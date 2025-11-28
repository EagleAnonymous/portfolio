document.addEventListener('DOMContentLoaded', () => {
    // --- Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('checkbox');
    const currentTheme = localStorage.getItem('theme');

    // Apply the saved theme on initial load
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeToggle.checked = true;
        }
    }

    themeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- Contact Form (for demonstration) ---
    const contactForm = document.querySelector('.contact-form');
    const formResult = document.getElementById('form-result');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevents the default form submission
        
        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        formResult.innerHTML = "Sending...";
        formResult.style.display = "block";

        fetch('http://localhost:5000/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status == 200) {
                    formResult.style.color = "green";
                    formResult.innerHTML = jsonResponse.message;
                } else {
                    formResult.style.color = "red";
                    formResult.innerHTML = jsonResponse.message || "Something went wrong!";
                }
            })
            .catch(error => {
                formResult.innerHTML = "Something went wrong!";
            })
            .then(function() {
                contactForm.reset();
                setTimeout(() => {
                    formResult.style.display = "none";
                }, 5000);
            });
    });
});
