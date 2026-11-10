document.documentElement.classList.add("js");

const year = document.getElementById("ano");
year.textContent = new Date().getFullYear();

const projectList = document.getElementById("project-list");
const projectLinks = {
  DeliFood: "https://adrianoliveiradev.github.io/DeliFood/",
  Records: "https://fililindev.github.io/Records/",
};

function createProjectCard(repository) {
  const card = document.createElement("a");
  const destination = projectLinks[repository.name] || repository.homepage || repository.html_url;
  const projectUrl = new URL(destination);

  if (projectUrl.protocol !== "http:" && projectUrl.protocol !== "https:") {
    throw new Error(`URL inválida para o repositório ${repository.name}.`);
  }

  card.className = "project";
  card.href = projectUrl.href;
  card.target = "_blank";
  card.rel = "noopener";

  const type = document.createElement("span");
  type.className = "type mono";
  type.textContent = repository.language
    ? `Projeto · ${repository.language}`
    : "Repositório público";

  const title = document.createElement("h3");
  title.textContent = repository.name;

  const description = document.createElement("p");
  description.textContent = repository.description || "Acesse o repositório para ver os detalhes do projeto.";

  const action = document.createElement("span");
  action.className = "go";
  action.textContent = repository.homepage || projectLinks[repository.name]
    ? "Abrir projeto →"
    : "Ver repositório →";

  card.append(type, title, description, action);
  return card;
}

async function loadProjects() {
  try {
    const repositories = [];
    let page = 1;

    while (true) {
      const response = await fetch(
        `https://api.github.com/users/FiLiLiNDeV/repos?per_page=100&page=${page}&sort=updated`,
        { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" },
      );

      if (!response.ok) {
        throw new Error(`GitHub respondeu com HTTP ${response.status}.`);
      }

      const currentPage = await response.json();
      repositories.push(...currentPage);

      if (currentPage.length < 100) {
        break;
      }

      page += 1;
    }

    if (repositories.length === 0) {
      throw new Error("Nenhum repositório público foi encontrado.");
    }

    const cards = repositories
      .filter((repository) => !repository.private)
      .filter((repository) => repository.name !== "FiLiLiNDeV")
      .filter((repository) => repository.homepage || projectLinks[repository.name])
      .map(createProjectCard);

    projectList.replaceChildren(...cards);
    projectList.setAttribute("aria-busy", "false");
  } catch (error) {
    console.error("Não foi possível carregar os projetos do GitHub.", error);
    const status = document.createElement("p");
    status.className = "project-status";
    status.setAttribute("role", "alert");
    status.textContent = "Não foi possível carregar os projetos agora. Acesse meu GitHub para ver os repositórios.";

    const profileLink = document.createElement("a");
    profileLink.href = "https://github.com/FiLiLiNDeV";
    profileLink.target = "_blank";
    profileLink.rel = "noopener";
    profileLink.textContent = "Abrir GitHub";
    status.append(" ", profileLink);

    projectList.replaceChildren(status);
    projectList.setAttribute("aria-busy", "false");
  }
}

loadProjects();

const contactPicker = document.querySelector(".contact-picker");
const contactToggle = document.querySelector(".contact-toggle");
const contactMenu = document.getElementById("contact-menu");

const closeContactMenu = () => {
  contactMenu.hidden = true;
  contactToggle.setAttribute("aria-expanded", "false");
};

contactToggle.addEventListener("click", () => {
  const isExpanded = contactToggle.getAttribute("aria-expanded") === "true";
  contactMenu.hidden = isExpanded;
  contactToggle.setAttribute("aria-expanded", String(!isExpanded));
});

document.addEventListener("click", (event) => {
  if (!contactPicker.contains(event.target)) {
    closeContactMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !contactMenu.hidden) {
    closeContactMenu();
    contactToggle.focus();
  }
});

contactMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeContactMenu();
  }
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in"));
}
