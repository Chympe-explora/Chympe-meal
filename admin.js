document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("adminTableBody");
  tbody.innerHTML = RESTAURANTS.map(
    (r) => `
    <tr>
      <td style="color:var(--ivory);">${r.name}</td>
      <td><span class="status-pill status-${r.status}">${r.status}</span></td>
      <td>${r.pinned ? '<i class="fa-solid fa-check" style="color:var(--gold-bright);"></i>' : "—"}</td>
      <td>${r.featured ? '<i class="fa-solid fa-check" style="color:var(--gold-bright);"></i>' : "—"}</td>
      <td class="mono">${r.rating}</td>
      <td>${r.createdAt}</td>
      <td>${r.status === "approved" ? `<a href="restaurant.html?id=${r.id}" style="color:var(--gold-bright);">View →</a>` : ""}</td>
    </tr>`
  ).join("");
});
