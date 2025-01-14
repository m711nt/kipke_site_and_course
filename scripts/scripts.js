document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.getElementById('mobileLinks');

    mobileMenu.addEventListener('click', () => {
        mobileLinks.classList.toggle('active'); 

        if (mobileLinks.classList.contains('active')) {
            mobileLinks.style.display = 'flex';
        } else {
            mobileLinks.style.display = 'none';
        }
    });
});

document.getElementById('serviceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const service = document.getElementById('service').value;
    const comment = document.getElementById('comment').value;

    alert('Спасибо за вашу заявку! Наш специалист свяжется с вами.');
    
    this.reset();
});
