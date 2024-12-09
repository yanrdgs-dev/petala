
const elementos = document.querySelectorAll('.container_funcao');


const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            
            if (entry.target.classList.contains('left')) {
                entry.target.classList.add('animar', 'left');
            } else if (entry.target.classList.contains('right')) {
                entry.target.classList.add('animar', 'right');
            }

            
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.25 
});


elementos.forEach(elemento => {
    observer.observe(elemento);
});
