import { addInViewAnimationToSingleElement } from "./helpers.js";

const sendEmailInfo = {
  send: function (a) {
    return new Promise(function (n, e) {
      (a.nocache = Math.floor(1e6 * Math.random() + 1)), (a.Action = "Send");
      var t = JSON.stringify(a);
      sendEmailInfo.ajaxPost(
        "https://smtpjs.com/v3/smtpjs.aspx?",
        t,
        function (e) {
          n(e);
        }
      );
    });
  },
  ajaxPost: function (e, n, t) {
    var a = sendEmailInfo.createCORSRequest("POST", e);
    a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
      (a.onload = function () {
        var e = a.responseText;
        null != t && t(e);
      }),
      a.send(n);
  },
  ajax: function (e, n) {
    var t = sendEmailInfo.createCORSRequest("GET", e);
    (t.onload = function () {
      var e = t.responseText;
      null != n && n(e);
    }),
      t.send();
  },
  createCORSRequest: function (e, n) {
    var t = new XMLHttpRequest();
    return (
      "withCredentials" in t
        ? t.open(e, n, !0)
        : "undefined" != typeof XDomainRequest
        ? (t = new XDomainRequest()).open(e, n)
        : (t = null),
      t
    );
  },
};

function createSelect(fd) {
  const select = document.createElement("select");
  select.id = fd.Field;
  if (fd.Placeholder) {
    const ph = document.createElement("option");
    ph.textContent = fd.Placeholder;
    ph.setAttribute("selected", "");
    ph.setAttribute("disabled", "");
    select.append(ph);
  }
  fd.Options.split(",").forEach((o) => {
    const option = document.createElement("option");
    option.textContent = o.trim();
    option.value = o.trim();
    select.append(option);
  });
  if (fd.Mandatory === "x") {
    select.setAttribute("required", "required");
  }
  return select;
}

function constructPayload(form) {
  const payload = {};
  [...form.elements].forEach((fe) => {
    if (fe.type === "checkbox") {
      if (fe.checked) payload[fe.id] = fe.value;
    } else if (fe.id) {
      payload[fe.id] = fe.value;
    }
  });
  return payload;
}

async function submitForm(form) {
  const payload = constructPayload(form);
  payload.timestamp = new Date().toJSON();
  const resp = await fetch(form.dataset.action, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: payload }),
  });
  await resp.text();
  return payload;
}

function createButton(fd) {
  const button = document.createElement("button");
  button.textContent = fd.Label;
  button.classList.add("button");
  if (fd.Type === "submit") {
    button.addEventListener("click", async (event) => {
      const form = button.closest("form");
      if (fd.Placeholder) form.dataset.action = fd.Placeholder;
      if (form.checkValidity()) {
        event.preventDefault();
        button.setAttribute("disabled", "");
        await submitForm(form);
        const payload = constructPayload(form);
        const redirectTo = fd.Extra;
        sendEmailInfo
          .send({
            SecureToken: "87d61bc9-fa68-4ae9-8253-02400551ee18",
            // Host: "smtp.elasticemail.com",
            // Username: "serhat_koyuncu@icloud.com",
            // Password: "9833A40F4298DDD82086DEBD38DE6D1D7BCB",
            To: "serhat_koyuncu@icloud.com",
            From: "serhat_koyuncu@icloud.com",
            Subject: "www.serhatkoyuncu.com iletişim sayfasından gelen mail",
            Body: `
            <h2>İletişim Maili</h2>
            <p><b>Gönderici Email :</b> ${payload.email} <br></p>
            <p><b>Konu :</b> ${payload.subject.toUpperCase()}<br></p>
            <p><b>Mesaj :</b><br><i>${payload.tellUsSomething}</i></p>
            `,
          })
          .then(() => (window.location.href = redirectTo));
      }
    });
  }
  return button;
}

function createHeading(fd, el) {
  const heading = document.createElement(el);
  heading.textContent = fd.Label;
  return heading;
}

function createInput(fd) {
  const input = document.createElement("input");
  input.type = fd.Type;
  input.id = fd.Field;
  input.setAttribute("placeholder", fd.Placeholder);
  if (fd.Mandatory === "x") {
    input.setAttribute("required", "required");
  }
  return input;
}

function createTextArea(fd) {
  const input = document.createElement("textarea");
  input.id = fd.Field;
  input.setAttribute("rows", "6");
  input.setAttribute("placeholder", fd.Placeholder);
  if (fd.Mandatory === "x") {
    input.setAttribute("required", "required");
  }
  return input;
}

function createLabel(fd) {
  const label = document.createElement("label");
  label.setAttribute("for", fd.Field);
  label.textContent = fd.Label;
  if (fd.Mandatory === "x") {
    label.classList.add("required");
  }
  return label;
}

function applyRules(form, rules) {
  const payload = constructPayload(form);
  rules.forEach((field) => {
    const {
      type,
      condition: { key, operator, value },
    } = field.rule;
    if (type === "visible") {
      if (operator === "eq") {
        if (payload[key] === value) {
          form.querySelector(`.${field.fieldId}`).classList.remove("hidden");
        } else {
          form.querySelector(`.${field.fieldId}`).classList.add("hidden");
        }
      }
    }
  });
}

function fill(form) {
  const { action } = form.dataset;
  if (action === "/tools/bot/register-form") {
    const loc = new URL(window.location.href);
    form.querySelector("#owner").value = loc.searchParams.get("owner") || "";
    form.querySelector("#installationId").value =
      loc.searchParams.get("id") || "";
  }
}

export async function createForm(formURL) {
  const { pathname } = new URL(formURL);
  const resp = await fetch(pathname);
  const json = await resp.json();
  const form = document.createElement("form");
  const rules = [];
  // eslint-disable-next-line prefer-destructuring
  form.dataset.action = pathname.split(".json")[0];
  json.data.forEach((fd, index) => {
    fd.Type = fd.Type || "text";
    const fieldWrapper = document.createElement("div");
    const style = fd.Style ? ` form-${fd.Style}` : "";
    const fieldId = `form-${fd.Type}-wrapper${style}`;
    fieldWrapper.className = fieldId;
    fieldWrapper.classList.add("field-wrapper");
    fieldWrapper.classList.add(`grid-item-${index + 1}`);
    switch (fd.Type) {
      case "select":
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createSelect(fd));
        break;
      case "heading":
        fieldWrapper.append(createHeading(fd, "h3"));
        break;
      case "legal":
        fieldWrapper.append(createHeading(fd, "p"));
        break;
      case "checkbox":
        fieldWrapper.append(createInput(fd));
        fieldWrapper.append(createLabel(fd));
        break;
      case "text-area":
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createTextArea(fd));
        break;
      case "submit":
        fieldWrapper.append(createButton(fd));
        break;
      default:
        fieldWrapper.append(createLabel(fd));
        fieldWrapper.append(createInput(fd));
    }

    if (fd.Rules) {
      try {
        rules.push({ fieldId, rule: JSON.parse(fd.Rules) });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`Invalid Rule ${fd.Rules}: ${e}`);
      }
    }
    form.append(fieldWrapper);
  });

  form.addEventListener("change", () => applyRules(form, rules));
  applyRules(form, rules);
  fill(form);
  return form;
}

export default async function decorate(block) {
  const form = block.querySelector('a[href$=".json"]');
  addInViewAnimationToSingleElement(block, "fade-up");
  if (form) {
    form.replaceWith(await createForm(form.href));
  }
}
