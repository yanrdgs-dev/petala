document.getElementById("profilePictureInput").addEventListener("change", async function (event) {
    let file = event.target.files[0];

    if (!file) return;

    let formData = new FormData();
    formData.append("profilePicture", file);

    let response = await fetch("/upload-profile", {
        method: "POST",
        body: formData
    });

    let result = await response.json();

    if (result.success) {
        document.getElementById("profileImage").src = result.imageUrl;
    } else {
        alert("Erro ao enviar imagem.");
    }
});
