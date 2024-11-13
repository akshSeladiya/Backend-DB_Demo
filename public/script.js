document.querySelectorAll('form[action*="_method=DELETE"]').forEach(form => {
    form.addEventListener('submit', function (e) {
        if (!confirm("Are you sure you want to delete this user?")) {
            e.preventDefault();
        }
    });
});
