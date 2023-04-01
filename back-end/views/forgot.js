const forgotButton=document.getElementById("forgotButton")
const email=document.getElementById("email")

forgotButton.addEventListener("click",forgotPassword)

async function forgotPassword(e){
    try{
        const obj={
            email:email.value
        }
        e.preventDefault()
        const data=await axios.post("http://localhost:5200/password/forgotpassword",obj)
        console.log(data)
        email.value=""
    }catch(err){
        console.log("forgotpassword err-->",err)
    }
}
