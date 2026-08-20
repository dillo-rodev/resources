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

        // If we're on the library page
        if (document.getElementById("scripting-resources")) {
            displayResources(data.resources);
        }

        // If we're on the documentation page
        if (document.getElementById("documentation-content")) {
            loadDocumentation(data.resources);
        }

    } catch (error) {

        console.error(error);

    }

}


// ==================================================
// DISPLAY RESOURCE CARDS
// ==================================================

function displayResources(resources) {

    const scriptingContainer =
        document.getElementById("scripting-resources");


    resources.forEach(resource => {

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
        // CARD
        // =========================

        card.appendChild(imageContainer);

        card.appendChild(info);


        scriptingContainer.appendChild(card);

    });

}


// ==================================================
// LOAD DOCUMENTATION
// ==================================================

async function loadDocumentation(resources) {

    const params =
        new URLSearchParams(window.location.search);

    const resourceID =
        params.get("resource");


    // No resource specified

    if (!resourceID) {

        showDocumentationError(
            "No resource was specified."
        );

        return;

    }


    // Find resource

    const resource =
        resources.find(
            item => item.id === resourceID
        );


    if (!resource) {

        showDocumentationError(
            "Resource could not be found."
        );

        return;

    }


    // Load markdown

    try {

        const response =
            await fetch(resource.documentation);


        if (!response.ok) {
            throw new Error(
                "Could not load documentation."
            );
        }


        const markdown =
            await response.text();


        displayDocumentation(
            markdown,
            resource
        );


    } catch (error) {

        console.error(error);

        showDocumentationError(
            "Could not load the documentation."
        );

    }

}


// ==================================================
// DISPLAY DOCUMENTATION
// ==================================================

function displayDocumentation(
    markdown,
    resource
) {

    const content =
        document.getElementById(
            "documentation-content"
        );


    // Convert Markdown → HTML

    content.innerHTML =
        marked.parse(markdown);


    // Add IDs to headings

    const headings =
        content.querySelectorAll(
            "h2, h3"
        );


    headings.forEach((heading, index) => {

        const id =
            createHeadingID(
                heading.textContent,
                index
            );


        heading.id = id;

    });


    // Create sidebar

    createDocumentationNavigation(
        headings
    );


    // Create right panel

    createInformationPanel(
        resource
    );


    // Syntax highlighting

    if (typeof Prism !== "undefined") {

        Prism.highlightAllUnder(content);

    }

}


// ==================================================
// CREATE HEADING ID
// ==================================================

function createHeadingID(
    text,
    index
) {

    const slug =
        text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");


    return slug || `heading-${index}`;

}


// ==================================================
// CREATE SIDEBAR
// ==================================================

function createDocumentationNavigation(
    headings
) {

    const navigation =
        document.getElementById(
            "documentation-navigation"
        );


    navigation.innerHTML = "";


    headings.forEach(heading => {

        const link =
            document.createElement("a");


        link.href =
            `#${heading.id}`;


        link.textContent =
            heading.textContent;


        // h2 / h3 hierarchy

        if (heading.tagName === "H2") {

            link.className =
                "heading-2";

        }

        if (heading.tagName === "H3") {

            link.className =
                "heading-3";

        }


        navigation.appendChild(link);

    });

}


// ==================================================
// CREATE INFORMATION PANEL
// ==================================================

function createInformationPanel(
    resource
) {

    const container =
        document.getElementById(
            "resource-information"
        );


    container.innerHTML = "";


    // Card

    const card =
        document.createElement("div");

    card.className =
        "info-card";


    // =========================
    // IMAGE
    // =========================

    if (resource.image) {

        const image =
            document.createElement("img");

        image.className =
            "info-image";

        image.src =
            resource.image;

        image.alt =
            resource.name;


        card.appendChild(image);

    }


    // =========================
    // CONTENT
    // =========================

    const content =
        document.createElement("div");

    content.className =
        "info-content";


    // Type

    const type =
        document.createElement("span");

    type.className =
        "info-type";

    type.textContent =
        resource.type;


    // Name

    const title =
        document.createElement("h2");

    title.textContent =
        resource.name;


    // Description

    const description =
        document.createElement("p");

    description.className =
        "info-description";

    description.textContent =
        resource.description;


    content.appendChild(type);

    content.appendChild(title);

    content.appendChild(description);


    // =========================
    // DOWNLOAD
    // =========================

    if (resource.download) {

        const download =
            document.createElement("a");

        download.className =
            "download-button";

        download.href =
            resource.download;

        download.textContent =
            "Download";


        download.setAttribute(
            "download",
            ""
        );


        content.appendChild(download);

    }


    card.appendChild(content);


    container.appendChild(card);

}


// ==================================================
// DOCUMENTATION ERROR
// ==================================================

function showDocumentationError(
    message
) {

    const content =
        document.getElementById(
            "documentation-content"
        );


    if (!content) {
        return;
    }


    content.innerHTML = `
        <h1>Oops.</h1>

        <p>
            ${message}
        </p>

        <a href="index.html">
            Return to the library
        </a>
    `;

}


// ==================================================
// START
// ==================================================

loadResources();
