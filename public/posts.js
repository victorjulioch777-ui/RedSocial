const postList = document.getElementById("postList");

let posts = JSON.parse(localStorage.getItem("posts")) || [];

if (posts.length === 0) {
  postList.innerHTML = "<p>No hay posts todavía.</p>";
} else {
  posts.forEach(function (post) {
    postList.innerHTML += `
      <div class="post">
        <strong>${post.writer}</strong><br />
        <span>${post.content}</span>
      </div>
      <hr />
    `;
  });
}
