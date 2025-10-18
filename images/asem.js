document.addEventListener("DOMContentLoaded", ()=>{
    const form=document.getElementById("voteForm");
    const nameInput=form.querySelector("[name='name']");
    const daySelect=form.querySelector("[name='favday']");
    const commentInput=form.querySelector("[name='comment']");

    function showError(input,message){
        const small=input.nextElementSibling;
        small.textContent=message;
        small.style.color="#b00020";
        input.style.borderColor="#b00020";
    }

    function clearError(input){
        const small=input.nextElementSibling;
        small.textContent="";
        input.style.borderColor="#ccc";
    }

    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        let isValid=true;

        if (nameInput.value.trim()===""){
            showError(nameInput,"please enter your name");
            isValid=false;
        }
        else{
            clearError(nameInput);
        }


        if (daySelect.value===""){
            showError(daySelect,"please select a day");
            isValid=false;
        }
        else{
            clearError(daySelect);
        }


        if (commentInput.value.trim()===""){
            showError(commentInput, "write at least 5 characters");
            isValid=false;
        }
        else{
            clearError(commentInput);
        }


        if (isValid){
            alert("thank you for your favorite");
            form.reset();
        }
        
    });

    [nameInput, daySelect, commentInput].forEach((field)=>{
        field.addEventListener("input", ()=>clearError(field));
    });

});


const d=new Date();
document.getElementById("datetime").innerHTML=d;


