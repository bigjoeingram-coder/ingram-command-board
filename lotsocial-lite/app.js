const form = document.querySelector("#vehicleForm");
const outputs = document.querySelector("#outputs");
const copyAll = document.querySelector("#copyAll");

function value(id) {
  return document.querySelector(`#${id}`).value.trim();
}

function vehicleName(data) {
  return [data.year, data.make, data.model, data.trim].filter(Boolean).join(" ") || "This vehicle";
}

function cleanFeatures(features) {
  return features
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function generate(data) {
  const name = vehicleName(data);
  const features = cleanFeatures(data.features);
  const featureLine = features.length ? ` Highlights include ${features.join(", ")}.` : "";
  const priceLine = data.price ? ` Listed at ${data.price}.` : "";
  const mileageLine = data.mileage ? ` Only ${data.mileage} miles.` : "";
  const sourceLine = data.vdpUrl ? `\n\nSource: ${data.vdpUrl}` : "";
  const cta = data.cta || "Message me for details or to check availability.";

  return [
    {
      title: "Primary social caption",
      text: `${name} is ready for someone who wants the right vehicle without making the shopping process harder than it needs to be.${featureLine}${mileageLine}${priceLine}\n\n${cta}${sourceLine}`,
    },
    {
      title: "Short caption",
      text: `${name}${data.price ? ` - ${data.price}` : ""}.${features[0] ? ` ${features[0]} and ready to show.` : " Ready to show."}\n\n${cta}${sourceLine}`,
    },
    {
      title: "Text message version",
      text: `I have a ${name}${data.mileage ? ` with ${data.mileage} miles` : ""}${data.price ? ` listed at ${data.price}` : ""}. ${cta}${data.vdpUrl ? ` ${data.vdpUrl}` : ""}`,
    },
  ];
}

async function copyText(text, button) {
  await navigator.clipboard.writeText(text);
  const original = button.textContent;
  button.textContent = "Copied";
  setTimeout(() => {
    button.textContent = original;
  }, 1300);
}

function renderVariants(variants) {
  outputs.innerHTML = "";
  for (const variant of variants) {
    const card = document.createElement("article");
    card.className = "variant";

    const title = document.createElement("b");
    title.textContent = variant.title;

    const body = document.createElement("p");
    body.textContent = variant.text;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Copy";
    button.addEventListener("click", () => copyText(variant.text, button));

    card.append(title, body, button);
    outputs.append(card);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = {
    vdpUrl: value("vdpUrl"),
    year: value("year"),
    make: value("make"),
    model: value("model"),
    trim: value("trim"),
    price: value("price"),
    mileage: value("mileage"),
    features: value("features"),
    cta: value("cta"),
  };
  renderVariants(generate(data));
});

copyAll.addEventListener("click", async () => {
  const text = [...document.querySelectorAll(".variant p")].map((node) => node.textContent).join("\n\n---\n\n");
  if (!text) return;
  await copyText(text, copyAll);
});
