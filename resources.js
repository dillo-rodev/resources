// ==================================================
// LOAD RESOURCES
// ==================================================

async function loadResources() {

    try {

        const response = await fetch("resources.json");

        if (!response.ok) {
            throw new Error("Could not load resources.json");
        }

        const data = await response.json();

        return data.resources;

    } catch (error) {

        console.error(error);

        return [];

    }

}


// ==================================================
// RESOURCE LIBRARY
// ==================================================

async function displayResources() {

    const container =
        document.getElementById("scripting-resources");

    // Not on resources.html
    if (!container) {
        return;
    }

    const resources =
        await loadResources();


    resources.forEach(resource => {

        if (resource.category !== "Scripting") {
            return;
        }


        // =========================
        // CARD
        // =========================

        const card =
            document.createElement("a");

        card.className =
            "resource-card";

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

        image.src =
            resource.image;

        image.alt =
            resource.name;


        imageContainer.appendChild(image);


        // =========================
        // INFO
        // =========================

        const info =
            document.createElement("div");

        info.className =
            "resource-info";


        const type =
            document.createElement("span");

        type.className =
            "resource-type";

        type.textContent =
            resource.type;


        const title =
            document.createElement("h3");

        title.textContent =
            resource.name;


        const description =
            document.createElement("p");

        description.textContent =
            resource.description;


        info.appendChild(type);
        info.appendChild(title);
        info.appendChild(description);


        // =========================
        // ADD CARD
        // =========================

        card.appendChild(imageContainer);
        card.appendChild(info);

        container.appendChild(card);

    });

}


// ==================================================
// LOAD DOCUMENTATION
// ==================================================

async function loadDocumentation() {

    const content =
        document.getElementById(
            "documentation-content"
        );

    // Not on docs.html
    if (!content) {
        return;
    }


    try {

        // =========================
        // GET RESOURCE ID
        // =========================

        const params =
            new URLSearchParams(
                window.location.search
            );

        const resourceId =
            params.get("resource");


        if (!resourceId) {
            throw new Error(
                "No resource specified."
            );
        }


        // =========================
        // LOAD RESOURCES
        // =========================

        const resources =
            await loadResources();


        const resource =
            resources.find(
                item => item.id === resourceId
            );


        if (!resource) {
            throw new Error(
                "Resource not found."
            );
        }


        // =========================
        // RESOURCE INFORMATION
        // =========================

        const image =
            document.getElementById(
                "resource-image"
            );

        const name =
            document.getElementById(
                "resource-name"
            );

        const type =
            document.getElementById(
                "resource-type"
            );

        const description =
            document.getElementById(
                "resource-description"
            );

        const download =
            document.getElementById(
                "resource-download"
            );


        image.src =
            resource.image;

        image.alt =
            resource.name;


        name.textContent =
            resource.name;


        type.textContent =
            resource.type;


        description.textContent =
            resource.description;


        // =========================
        // DOWNLOAD
        // =========================

        if (resource.download) {

            download.href =
                resource.download;

            download.style.display =
                "block";

        } else {

            download.style.display =
                "none";

        }


        // =========================
        // LOAD MARKDOWN
        // =========================

        if (!resource.documentation) {

            throw new Error(
                "Documentation path is missing."
            );

        }


        const markdownResponse =
            await fetch(
                resource.documentation
            );


        if (!markdownResponse.ok) {

            throw new Error(
                `Could not load ${resource.documentation}`
            );

        }


        const markdown =
            await markdownResponse.text();


        // =========================
        // RENDER MARKDOWN
        // =========================

        content.innerHTML =
            marked.parse(markdown);


        // =========================
        // CREATE CONTENTS
        // =========================

        createDocumentationNavigation(
            content
        );


        // =========================
        // SYNTAX HIGHLIGHTING
        // =========================

        if (window.Prism) {

            Prism.highlightAll();

        }


    } catch (error) {

        console.error(
            "Documentation error:",
            error
        );


        content.innerHTML = `
            <h1>Oops.</h1>
            <p>Could not load the documentation.</p>
        `;

    }

}


// ==================================================
// CREATE DOCUMENTATION SIDEBAR
// ==================================================

function createDocumentationNavigation(content) {

    const navigation =
        document.getElementById(
            "documentation-navigation"
        );

    if (!navigation) {
        return;
    }


    navigation.innerHTML = "";


    const headings =
        content.querySelectorAll(
            "h1, h2, h3"
        );


    headings.forEach((heading, index) => {

        // =========================
        // CREATE ID
        // =========================

        if (!heading.id) {

            heading.id =
                `section-${index}`;

        }


        // =========================
        // CREATE LINK
        // =========================

        const link =
            document.createElement("a");


        link.href =
            `#${heading.id}`;


        link.textContent =
            heading.textContent;


        // =========================
        // HEADING LEVEL
        // =========================

        if (heading.tagName === "H1") {

            link.className =
                "heading-1";

        }

        else if (heading.tagName === "H2") {

            link.className =
                "heading-2";

        }

        else if (heading.tagName === "H3") {

            link.className =
                "heading-3";

        }


        navigation.appendChild(link);

    });

}


// ==================================================
// START
// ==================================================

displayResources();

loadDocumentation();
