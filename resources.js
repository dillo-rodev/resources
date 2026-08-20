// =========================
// LOAD RESOURCES
// =========================

async function loadResources() {

    try {

        const response = await fetch("resources.json");

        if (!response.ok) {
            throw new Error("Could not load resources.json");
        }

        const data = await response.json();

        displayResources(data.resources);

    } catch (error) {

        console.error(error);

    }

}


// =========================
// DISPLAY RESOURCES
// =========================

function displayResources(resources) {

    const scriptingContainer =
        document.getElementById("scripting-resources");


    resources.forEach(resource => {

        // Only put scripting resources
        // in the scripting section.

        if (resource.category !== "Scripting") {
            return;
        }


        const card = document.createElement("a");

        card.className = "resource-card";

        card.href =
            `docs.html?resource=${encodeURIComponent(resource.id)}`;


        // =========================
        // IMAGE
        // =========================

        const imageContainer =
            document.createElement("div");

        imageContainer.className =
            "resource-image";


        const image =
            document.createElement("img");

        image.src = resource.image;

        image.alt = resource.name;


        imageContainer.appendChild(image);


        // =========================
        // INFO
        // =========================

        const info =
            document.createElement("div");

        info.className = "resource-info";


        const type =
            document.createElement("span");

        type.className = "resource-type";

        type.textContent = resource.type;


        const title =
            document.createElement("h3");

        title.textContent = resource.name;


        const description =
            document.createElement("p");

        description.textContent =
            resource.description;


        info.appendChild(type);

        info.appendChild(title);

        info.appendChild(description);


        // =========================
        // CARD
        // =========================

        card.appendChild(imageContainer);

        card.appendChild(info);


        scriptingContainer.appendChild(card);

    });

}


// =========================
// START
// =========================

loadResources();
