
        function showToast(title) {
            alert('Article Opening: Opening article: ' + title);
        }

        // Image enlargement functionality
        const modal = document.getElementById("imageModal");
        const img = document.getElementById("fridgeImage");
        const modalImg = document.getElementById("modalImage");
        const captionText = document.getElementById("caption");
        const span = document.getElementsByClassName("close")[0];

        img.onclick = function(){
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
        }

        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
