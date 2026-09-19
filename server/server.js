const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;


// =========================================
// DATABASE
// =========================================

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not configured.");
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


// =========================================
// INITIALIZE DATABASE
// =========================================

async function initializeDatabase() {

    await pool.query(`
        CREATE TABLE IF NOT EXISTS profiles (

            id TEXT PRIMARY KEY,

            category TEXT,

            name TEXT NOT NULL,

            email TEXT NOT NULL,

            phone TEXT,

            website TEXT,

            linkedin TEXT,

            github TEXT,

            skills TEXT,

            experience TEXT,

            "businessName" TEXT,

            "businessLocation" TEXT,

            bio TEXT,

            "profilePhoto" TEXT,

            "createdAt" TEXT

        )
    `);

    console.log("💾 PostgreSQL database connected!");
    console.log("📦 Profiles table ready!");

}


// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());

app.use(
    express.json({
        limit: "10mb"
    })
);


const websitePath = path.join(__dirname, "..");

app.use(express.static(websitePath));


// =========================================
// HOME PAGE
// =========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            websitePath,
            "index.html"
        )
    );

});


// =========================================
// TEST API
// =========================================

app.get("/api/test", (req, res) => {

    res.json({

        success: true,

        message: "Backend is working!"

    });

});


// =========================================
// CREATE PROFILE
// =========================================

app.post("/api/profile", async (req, res) => {

    try {

        const {

            category,
            name,
            email,
            phone,
            website,
            linkedin,
            github,
            skills,
            experience,
            businessName,
            businessLocation,
            bio,
            profilePhoto

        } = req.body;


        // =====================================
        // VALIDATION
        // =====================================

        if (!name || !email) {

            return res.status(400).json({

                success: false,

                message:
                    "Name and email are required."

            });

        }


        // =====================================
        // GENERATE UNIQUE PROFILE ID
        // =====================================

        const id =
            "QR" +
            Date.now()
                .toString(36)
                .toUpperCase();


        // =====================================
        // PROFILE OBJECT
        // =====================================

        const profile = {

            id,

            category:
                category || "Personal",

            name,

            email,

            phone:
                phone || "",

            website:
                website || "",

            linkedin:
                linkedin || "",

            github:
                github || "",

            skills:
                skills || "",

            experience:
                experience || "",

            businessName:
                businessName || "",

            businessLocation:
                businessLocation || "",

            bio:
                bio || "",

            profilePhoto:
                profilePhoto || "",

            createdAt:
                new Date().toISOString()

        };


        // =====================================
        // SAVE PROFILE TO POSTGRESQL
        // =====================================

        await pool.query(
            `
            INSERT INTO profiles (

                id,
                category,
                name,
                email,
                phone,
                website,
                linkedin,
                github,
                skills,
                experience,
                "businessName",
                "businessLocation",
                bio,
                "profilePhoto",
                "createdAt"

            )

            VALUES (

                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10,
                $11,
                $12,
                $13,
                $14,
                $15

            )
            `,
            [

                profile.id,
                profile.category,
                profile.name,
                profile.email,
                profile.phone,
                profile.website,
                profile.linkedin,
                profile.github,
                profile.skills,
                profile.experience,
                profile.businessName,
                profile.businessLocation,
                profile.bio,
                profile.profilePhoto,
                profile.createdAt

            ]
        );


        // =====================================
        // GENERATE PROFILE URL
        // =====================================

        const profileUrl =
            `${req.protocol}://${req.get("host")}/profile.html?id=${id}`;


        // =====================================
        // RESPONSE
        // =====================================

        res.status(201).json({

            success: true,

            message:
                "Profile created successfully!",

            profileId:
                id,

            profileUrl,

            profile

        });

    }

    catch (error) {

        console.error(
            "❌ Profile creation error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to create profile."

        });

    }

});


// =========================================
// GET PROFILE
// =========================================

app.get(
    "/api/profile/:id",
    async (req, res) => {

        try {

            const id =
                req.params.id;


            // =================================
            // FIND PROFILE
            // =================================

            const result =
                await pool.query(
                    `
                    SELECT *
                    FROM profiles
                    WHERE id = $1
                    `,
                    [id]
                );


            const profile =
                result.rows[0];


            // =================================
            // PROFILE NOT FOUND
            // =================================

            if (!profile) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Profile not found."

                });

            }


            // =================================
            // RETURN PROFILE
            // =================================

            res.json({

                success: true,

                profile

            });

        }

        catch (error) {

            console.error(
                "❌ Profile fetch error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch profile."

            });

        }

    }
);


// =========================================
// DATABASE ERROR HANDLER
// =========================================

pool.on("error", (error) => {

    console.error(
        "❌ Unexpected PostgreSQL error:",
        error
    );

});


// =========================================
// START SERVER
// =========================================

async function startServer() {

    try {

        await initializeDatabase();

        app.listen(
            PORT,
            () => {

                console.log("");

                console.log(
                    "================================="
                );

                console.log(
                    "🚀 QR Platform Server Started"
                );

                console.log(
                    `🌐 http://localhost:${PORT}`
                );

                console.log(
                    "💾 Database: PostgreSQL"
                );

                console.log(
                    "================================="
                );

                console.log("");

            }
        );

    }

    catch (error) {

        console.error(
            "❌ Failed to start server:",
            error
        );

        process.exit(1);

    }

}


startServer();