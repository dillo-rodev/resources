// ==================================================
// RESOURCES SYSTEM
// ==================================================


// ==================================================
// LOAD RESOURCES JSON
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

        console.error("Resource loading error:", error);

        return [];

    }

}


// ==================================================
// RESOURCE LIBRARY
// ==================================================

async function displayResources() {

    const container =
        document.getElementById("scripting-resources");

    // Not on the resources page
    if (!container) {
        return;
    }


    const resources =
        await loadResources();


    resources.forEach(resource => {

        // Only show scripting resources
        if (resource.category !== "Scripting") {
            return;
        }


        // ==================================================
        // CARD
        // ==================================================

        const card =
            document.createElement("a");

        card.className =
            "resource-card";

        card.href =
            `docs.html?resource=${encodeURIComponent(resource.id)}`;


        // ==================================================
        // IMAGE
        // ==================================================

        const imageContainer =
            document.createElement("div");

        imageContainer.className =
            "resource-image";


        const image =
            document.createElement("img");

        image.src =
            resource.image || "";

        image.alt =
            resource.name || "";


        imageContainer.appendChild(image);


        // ==================================================
        // INFO
        // ==================================================

        const info =
            document.createElement("div");

        info.className =
            "resource-info";


        const type =
            document.createElement("span");

        type.className =
            "resource-type";

        type.textContent =
            resource.type || "";


        const title =
            document.createElement("h3");

        title.textContent =
            resource.name || "";


        const description =
            document.createElement("p");

        description.textContent =
            resource.description || "";


        info.appendChild(type);
        info.appendChild(title);
        info.appendChild(description);


        // ==================================================
        // ADD TO CARD
        // ==================================================

        card.appendChild(imageContainer);
        card.appendChild(info);


        container.appendChild(card);

    });

}


// ==================================================
// DOCUMENTATION
// ==================================================

async function loadDocumentation() {

    const content =
        document.getElementById(
            "documentation-content"
        );

    // Not on documentation page
    if (!content) {
        return;
    }


    const navigation =
        document.getElementById(
            "documentation-navigation"
        );


    try {

        // ==================================================
        // GET RESOURCE ID
        // ==================================================

        const params =
            new URLSearchParams(
                window.location.search
            );

        const resourceId =
            params.get("resource");


        if (!resourceId) {
            throw new Error(
                "No resource ID was provided."
            );
        }


        // ==================================================
        // LOAD RESOURCES
        // ==================================================

        const resources =
            await loadResources();


        const resource =
            resources.find(
                item => item.id === resourceId
            );


        if (!resource) {

            throw new Error(
                `Resource "${resourceId}" was not found.`
            );

        }


        // ==================================================
        // RESOURCE INFORMATION
        // ==================================================

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


        if (image) {

            image.src =
                resource.image || "";

            image.alt =
                resource.name || "";

        }


        if (name) {

            name.textContent =
                resource.name || "";

        }


        if (type) {

            type.textContent =
                resource.type || "";

        }


        if (description) {

            description.textContent =
                resource.description || "";

        }


        // ==================================================
        // DOWNLOAD
        // ==================================================

        if (download) {

            if (resource.download) {

                download.href =
                    resource.download;

                download.style.display =
                    "block";

            } else {

                download.style.display =
                    "none";

            }

        }


        // ==================================================
        // LOAD MARKDOWN
        // ==================================================

        if (!resource.md) {

            throw new Error(
                "This resource has no Markdown file."
            );

        }


        const markdownResponse =
            await fetch(resource.md);


        if (!markdownResponse.ok) {

            throw new Error(
                `Could not load Markdown: ${resource.md}`
            );

        }


        const markdown =
            await markdownResponse.text();


        // ==================================================
        // RENDER MARKDOWN
        // ==================================================

        if (typeof marked === "undefined") {

            throw new Error(
                "Marked.js could not be loaded."
            );

        }


        content.innerHTML =
            marked.parse(markdown);


        // ==================================================
        // CREATE SIDEBAR
        // ==================================================

        createDocumentationNavigation(
            content,
            navigation
        );


        // ==================================================
        // PRISM
        // ==================================================

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

            <p>
                Could not load the documentation.
            </p>
        `;

    }

}


// ==================================================
// DOCUMENTATION SIDEBAR
// ==================================================

function createDocumentationNavigation(
    content,
    navigation
) {

    if (!navigation) {
        return;
    }


    navigation.innerHTML = "";


    const headings =
        content.querySelectorAll(
            "h1, h2, h3"
        );


    headings.forEach(
        (heading, index) => {

            // Create ID

            if (!heading.id) {

                heading.id =
                    `section-${index}`;

            }


            // Create link

            const link =
                document.createElement("a");


            link.href =
                `#${heading.id}`;


            link.textContent =
                heading.textContent;


            // Heading level

            if (
                heading.tagName === "H1"
            ) {

                link.className =
                    "heading-1";

            }

            else if (
                heading.tagName === "H2"
            ) {

                link.className =
                    "heading-2";

            }

            else if (
                heading.tagName === "H3"
            ) {

                link.className =
                    "heading-3";

            }


            navigation.appendChild(link);

        }
    );

}


// ==================================================
// START
// ==================================================

displayResources();
loadDocumentation();
