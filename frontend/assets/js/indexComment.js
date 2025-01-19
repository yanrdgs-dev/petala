let currentIndex = 1;
const totalComments = 3;

function showComment(index) {
  for (let i = 1; i <= totalComments; i++) {
    const comment = document.getElementById(`comment-${i}`);
    comment.classList.remove("active");
  }

  const currentComment = document.getElementById(`comment-${index}`);
  currentComment.classList.add("active");
}

function nextComment() {
  currentIndex = currentIndex < totalComments ? currentIndex + 1 : 1;
  showComment(currentIndex);
}

function prevComment() {
  currentIndex = currentIndex > 1 ? currentIndex - 1 : totalComments;
  showComment(currentIndex);
}

showComment(currentIndex);
