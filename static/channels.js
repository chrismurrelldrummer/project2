document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll('.btn').forEach(function (button) {

        button.style.border = button.dataset.cs;
    });

});