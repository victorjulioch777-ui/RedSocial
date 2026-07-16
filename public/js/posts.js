const postList = document.getElementById("postList");

let posts = JSON.parse(localStorage.getItem("posts")) || [];

if (posts.length === 0) {
  postList.innerHTML = "<p class='empty-state'>No hay posts todavía. ¡Sé el primero en escribir uno!</p>";
} else {
  posts.forEach(function (post, index) {
    const div = document.createElement("div");
    div.className = "post";
    div.style.animationDelay = (index * 60) + "ms";
    div.innerHTML =
      "<strong>" + post.writer + "</strong>" +
      "<span>" + post.content + "</span>";
    postList.appendChild(div);
  });
}
