document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleciona todos os botões de pergunta
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        // 2. Adiciona um "ouvinte de evento" (event listener) a cada botão
        question.addEventListener('click', () => {
            
            // Encontra a div de resposta imediatamente após o botão
            // O elemento de resposta é o próximo "irmão" do botão
            const answer = question.nextElementSibling;

            // 3. Verifica se a resposta está aberta ou fechada

            // Se a resposta JÁ TIVER a classe 'open', ela será FECHADA
            if (answer.classList.contains('open')) {
                answer.classList.remove('open');
            } else {
                // Se NÃO tiver a classe 'open', ela será ABERTA

                // (Opcional) Fechar todas as outras respostas abertas
                // Isso garante que apenas uma resposta fique aberta por vez.
                document.querySelectorAll('.faq-answer.open').forEach(openAnswer => {
                    if (openAnswer !== answer) {
                        openAnswer.classList.remove('open');
                    }
                });
                
                // Abre a resposta atual
                answer.classList.add('open');
            }
        });
    });
});