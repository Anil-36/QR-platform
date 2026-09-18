const express = require("express");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;


// =========================================
// DATABASE
// =========================================

const dbPath = path.join(__dirname, "profiles.db");

const db = new Database(dbPath);


// Create profiles table if it doesn't exist

db.prepare(`
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

        businessName TEXT,

        businessLocation TEXT,

        bio TEXT,

        profilePhoto TEXT,

        createdAt TEXT

    )
`).run();


console.log("💾 SQLite database connected!");


// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());

app.use(
    express.json({
        limit: "10mb"
    })
);


const websitePath =
    path.join(__dirname, "..");


app.use(
    express.static(websitePath)
);


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

        message:
            "Backend is working!"

    });

});


// =========================================
// CREATE PROFILE
// =========================================

app.post("/api/profile", (req, res) => {

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
        // PROFILE DATA
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
        // SAVE TO SQLITE
        // =====================================

        const insertProfile = db.prepare(`

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

                businessName,

                businessLocation,

                bio,

                profilePhoto,

                createdAt

            )

            VALUES (

                @id,

                @category,

                @name,

                @email,

                @phone,

                @website,

                @linkedin,

                @github,

                @skills,

                @experience,

                @businessName,

                @businessLocation,

                @bio,

                @profilePhoto,

                @createdAt

            )

        `);


        insertProfile.run(profile);


        // =====================================
        // PROFILE URL
        // =====================================

        const profileUrl =
            `http://localhost:${PORT}/profile.html?id=${id}`;


        // =====================================
        // RESPONSE
        // =====================================

        res.json({

            success: true,

            message:
                "Profile created successfully!",

            profileId:
                id,

            profileUrl:
                profileUrl,

            profile:
                profile

        });

    }

    catch (error) {

        console.error(
            "Profile creation error:",
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
    (req, res) => {

        try {

            const id =
                req.params.id;


            // =================================
            // FIND PROFILE
            // =================================

            const profile =
                db
                    .prepare(`
                        SELECT *
                        FROM profiles
                        WHERE id = ?
                    `)
                    .get(id);


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

                profile:
                    profile

            });

        }

        catch (error) {

            console.error(
                "Profile fetch error:",
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
// START SERVER
// =========================================

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
            "💾 Database: profiles.db"
        );

        console.log(
            "================================="
        );

        console.log("");

    }
);