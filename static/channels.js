document.addEventListener("DOMContentLoaded", function () {
    

    document.querySelectorAll('.btn').forEach(function () {

        this.style.background = this.dataset.cs;
    });

});