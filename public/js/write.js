const form = document.getElementById("postForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const writer = document.getElementById("writer").value;
  const content = document.getElementById("content").value;

  const newPost = {
    writer: writer,
    content: content,
  };

  let posts = JSON.parse(localStorage.getItem("posts")) || [];

  posts.push(newPost);

  localStorage.setItem("posts", JSON.stringify(posts));

  window.location.href = "/posts";
});
