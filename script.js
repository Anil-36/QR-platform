// ===============================
// QR PLATFORM - SCRIPT
// ===============================

let selectedCategory = "Personal";


// ===============================
// OPEN CREATE SECTION
// ===============================

function openCreateSection() {

    const section =
        document.getElementById("create");

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ===============================
// OPEN PROFILE FORM
// ===============================

function openProfileForm(category) {

    selectedCategory = category;

    const formSection =
        document.getElementById("formSection");

    const formTitle =
        document.getElementById("formTitle");

    const formDescription =
        document.getElementById("formDescription");


    if (!formSection) {

        alert("Form section not found.");

        return;

    }


    // ===============================
    // UPDATE TITLE
    // ===============================

    if (formTitle) {

        formTitle.textContent =
            category + " Digital Profile";

    }


    // ===============================
    // UPDATE DESCRIPTION
    // ===============================

    if (formDescription) {

        if (category === "Personal") {

            formDescription.textContent =
                "Enter your personal details below.";

        }

        else if (category === "Professional") {

            formDescription.textContent =
                "Showcase your professional identity, skills and experience.";

        }

        else if (category === "Business") {

            formDescription.textContent =
                "Add your business information and contact details.";

        }

    }


    // ===============================
    // GET FIELDS
    // ===============================

    const linkedinGroup =
        document.getElementById(
            "linkedinGroup"
        );

    const githubGroup =
        document.getElementById(
            "githubGroup"
        );

    const skillsGroup =
        document.getElementById(
            "skillsGroup"
        );

    const experienceGroup =
        document.getElementById(
            "experienceGroup"
        );

    const businessNameGroup =
        document.getElementById(
            "businessNameGroup"
        );

    const businessLocationGroup =
        document.getElementById(
            "businessLocationGroup"
        );


    // ===============================
    // HIDE OPTIONAL FIELDS
    // ===============================

    if (linkedinGroup)
        linkedinGroup.style.display = "none";

    if (githubGroup)
        githubGroup.style.display = "none";

    if (skillsGroup)
        skillsGroup.style.display = "none";

    if (experienceGroup)
        experienceGroup.style.display = "none";

    if (businessNameGroup)
        businessNameGroup.style.display = "none";

    if (businessLocationGroup)
        businessLocationGroup.style.display = "none";


    // ===============================
    // PERSONAL
    // ===============================

    if (category === "Personal") {

        if (linkedinGroup)
            linkedinGroup.style.display = "block";

    }


    // ===============================
    // PROFESSIONAL
    // ===============================

    if (category === "Professional") {

        if (linkedinGroup)
            linkedinGroup.style.display = "block";

        if (githubGroup)
            githubGroup.style.display = "block";

        if (skillsGroup)
            skillsGroup.style.display = "block";

        if (experienceGroup)
            experienceGroup.style.display = "block";

    }


    // ===============================
    // BUSINESS
    // ===============================

    if (category === "Business") {

        if (businessNameGroup)
            businessNameGroup.style.display = "block";

        if (businessLocationGroup)
            businessLocationGroup.style.display = "block";


        const website =
            document.getElementById(
                "website"
            );


        if (website) {

            website.placeholder =
                "https://yourbusiness.com";

        }

    }


    formSection.style.display = "block";


    formSection.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ===============================
// PAGE LOADED
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const form =
            document.getElementById(
                "profileForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                createProfile
            );

        }


        // ===============================
        // PROFILE PHOTO PREVIEW
        // ===============================

        const photoInput =
            document.getElementById(
                "profilePhoto"
            );

        const photoPreview =
            document.getElementById(
                "photoPreview"
            );


        if (
            photoInput &&
            photoPreview
        ) {

            photoInput.addEventListener(
                "change",
                function () {

                    const file =
                        this.files[0];


                    if (!file) {

                        return;

                    }


                    // ===============================
                    // FILE SIZE CHECK
                    // ===============================

                    if (
                        file.size >
                        5 * 1024 * 1024
                    ) {

                        alert(
                            "Profile photo must be less than 5MB."
                        );

                        this.value = "";

                        return;

                    }


                    // ===============================
                    // FILE TYPE CHECK
                    // ===============================

                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        alert(
                            "Please select an image file."
                        );

                        this.value = "";

                        return;

                    }


                    // ===============================
                    // PREVIEW
                    // ===============================

                    const reader =
                        new FileReader();


                    reader.onload =
                        function (event) {

                            photoPreview.innerHTML = `

                                <img
                                    src="${event.target.result}"
                                    alt="Profile Photo"
                                >

                            `;

                        };


                    reader.readAsDataURL(file);

                }
            );

        }

    }
);


// ===============================
// CREATE PROFILE
// ===============================

async function createProfile(event) {

    event.preventDefault();


    // ===============================
    // GET BASIC DETAILS
    // ===============================

    const name =
        document.getElementById(
            "name"
        ).value.trim();


    const email =
        document.getElementById(
            "email"
        ).value.trim();


    const phone =
        document.getElementById(
            "phone"
        ).value.trim();


    const website =
        document.getElementById(
            "website"
        ).value.trim();


    const linkedin =
        document.getElementById(
            "linkedin"
        ).value.trim();


    const github =
        document.getElementById(
            "github"
        ).value.trim();


    const skills =
        document.getElementById(
            "skills"
        )?.value.trim() || "";


    const experience =
        document.getElementById(
            "experience"
        )?.value.trim() || "";


    const businessName =
        document.getElementById(
            "businessName"
        )?.value.trim() || "";


    const businessLocation =
        document.getElementById(
            "businessLocation"
        )?.value.trim() || "";


    const bio =
        document.getElementById(
            "bio"
        ).value.trim();


    // ===============================
    // PROFILE PHOTO
    // ===============================

    const photoInput =
        document.getElementById(
            "profilePhoto"
        );


    // ===============================
    // VALIDATION
    // ===============================

    if (!name) {

        alert(
            "Please enter your name."
        );

        return;

    }


    if (!email) {

        alert(
            "Please enter your email."
        );

        return;

    }


    // ===============================
    // BUTTON
    // ===============================

    const button =
        document.querySelector(
            ".generate-btn"
        );


    if (button) {

        button.disabled = true;

        button.textContent =
            "Creating Profile...";

    }


    try {

        let profilePhoto = "";


        // ===============================
        // READ PHOTO
        // ===============================

        if (
            photoInput &&
            photoInput.files &&
            photoInput.files[0]
        ) {

            const file =
                photoInput.files[0];


            if (
                file.size >
                5 * 1024 * 1024
            ) {

                alert(
                    "Profile photo must be less than 5MB."
                );

                return;

            }


            profilePhoto =
                await readFileAsDataURL(
                    file
                );

        }


        // ===============================
        // SEND TO BACKEND
        // ===============================

        const response =
            await fetch(
                "/api/profile",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        category:
                            selectedCategory,

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

                    })

                }
            );


        const data =
            await response.json();


        // ===============================
        // CHECK RESPONSE
        // ===============================

        if (
            !response.ok ||
            !data.success
        ) {

            alert(
                data.message ||
                "Profile creation failed."
            );

            return;

        }


        // ===============================
        // PROFILE LINK
        // ===============================

        const profileLink =
            document.getElementById(
                "profileLink"
            );


        if (profileLink) {

            profileLink.value =
                data.profileUrl;

        }


        // ===============================
        // SHOW QR
        // ===============================

        showQRCode(
            data.profileUrl
        );

    }


    catch (error) {

        console.error(error);

        alert(
            "Server connection failed. Make sure the server is running."
        );

    }


    finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "Generate My QR Code";

        }

    }

}


// ===============================
// READ FILE AS DATA URL
// ===============================

function readFileAsDataURL(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function () {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                function () {

                    reject(
                        reader.error
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


// ===============================
// SHOW QR CODE
// ===============================

function showQRCode(profileUrl) {

    const qrSection =
        document.getElementById(
            "qrSection"
        );


    const qrContainer =
        document.getElementById(
            "qrcode"
        );


    if (!qrContainer) {

        alert(
            "QR container not found."
        );

        return;

    }


    qrContainer.innerHTML = "";


    if (
        typeof QRCode ===
        "undefined"
    ) {

        alert(
            "QR Code library is not loaded."
        );

        return;

    }


    new QRCode(

        qrContainer,

        {

            text:
                profileUrl,

            width:
                230,

            height:
                230,

            colorDark:
                "#111827",

            colorLight:
                "#ffffff",

            correctLevel:
                QRCode.CorrectLevel.H

        }

    );


    if (qrSection) {

        qrSection.style.display =
            "block";


        setTimeout(
            function () {

                qrSection.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"

                });

            },
            200
        );

    }

}


// ===============================
// COPY PROFILE LINK
// ===============================

async function copyProfileLink() {

    const input =
        document.getElementById(
            "profileLink"
        );


    if (
        !input ||
        !input.value
    ) {

        return;

    }


    try {

        await navigator.clipboard.writeText(
            input.value
        );

        showCopyMessage();

    }

    catch (error) {

        input.select();

        document.execCommand(
            "copy"
        );

        showCopyMessage();

    }

}


// ===============================
// COPY MESSAGE
// ===============================

function showCopyMessage() {

    const message =
        document.getElementById(
            "copyMessage"
        );


    if (!message) {

        return;

    }


    message.textContent =
        "✓ Profile link copied!";


    setTimeout(
        function () {

            message.textContent =
                "";

        },
        2000
    );

}


// ===============================
// DOWNLOAD QR
// ===============================

function downloadQR() {

    const qrContainer =
        document.getElementById(
            "qrcode"
        );


    if (!qrContainer) {

        return;

    }


    const canvas =
        qrContainer.querySelector(
            "canvas"
        );


    if (!canvas) {

        alert(
            "QR code not available."
        );

        return;

    }


    const link =
        document.createElement(
            "a"
        );


    link.href =
        canvas.toDataURL(
            "image/png"
        );


    link.download =
        "qr-platform-profile.png";


    link.click();

}


// ===============================
// CREATE NEW PROFILE
// ===============================

function createNewProfile() {

    const form =
        document.getElementById(
            "profileForm"
        );


    const qrSection =
        document.getElementById(
            "qrSection"
        );


    if (form) {

        form.reset();

    }


    // Reset photo preview

    const photoPreview =
        document.getElementById(
            "photoPreview"
        );


    if (photoPreview) {

        photoPreview.innerHTML =
            "👤";

    }


    if (qrSection) {

        qrSection.style.display =
            "none";

    }


    const formSection =
        document.getElementById(
            "formSection"
        );


    if (formSection) {

        formSection.style.display =
            "block";

        formSection.scrollIntoView({

            behavior:
                "smooth"

        });

    }


    selectedCategory =
        "Personal";

}


// ===============================
// END
// ===============================