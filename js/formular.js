function onSubmitForm() {
    const elem = document.getElementById("yourName");
    const name = elem.value;
    document.querySelector("[name='message']").value = `Cześć ${name},<br> miło, że dołączyłeś do Nas, baw się z PulpFitnes`;
}