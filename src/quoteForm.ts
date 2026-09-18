const RECIPIENT = "seb.thms.pro@gmail.com";

export function initQuoteForm(): void {
  const form = document.getElementById("quote-form");
  const status = document.getElementById("quote-status");
  if (!(form instanceof HTMLFormElement)) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    const name = value("name");
    const projectType = value("projectType");
    const subject = `Demande de devis — ${projectType} — ${name}`;
    const body = [
      `Nom : ${name}`,
      `E-mail : ${value("email")}`,
      `Type de projet : ${projectType}`,
      `Budget indicatif : ${value("budget")}`,
      `Échéance souhaitée : ${value("deadline") || "À définir"}`,
      "",
      "Besoin :",
      value("details"),
    ].join("\n");

    if (status) {
      status.textContent = "Votre demande est prête dans votre application e-mail.";
    }

    window.location.href =
      `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  });
}
