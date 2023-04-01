
const amount=document.getElementById("amount")
const description=document.getElementById("description")
const category=document.getElementById("category")
const addExpense=document.getElementById("expense")
const allExpenses=document.getElementById("allExpenses")

//used do decode jwt
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

//Fetching the expense from database
window.addEventListener("DOMContentLoaded",async()=>{
   try{
    
        const tokenId=localStorage.getItem("token")
        const decodeToken=parseJwt(tokenId)
        if(decodeToken.isPremium){
            document.getElementById("razorpay").style.visibility="hidden"
            // document.getElementById("addText").innerHTML="Premium purchased"
            showLeaderBoard()
            downloadReport()
        }
        
        pagination()
        
   }catch(err){
    console.log("windowOnload error",err)
   }
})

 //creating a pagination system
async function pagination(){
    try{
        const token=localStorage.getItem("token")
        const data=await axios.get("http://localhost:5200/expense/get-expense",{headers:{"Authorization":token}})
        const pagination=document.getElementById("pagination")
        
       const totalPagesize=localStorage.getItem("pageSize")
       const totalpage=Math.ceil((data.data.allExpenses.length)/totalPagesize)
       if(!totalPagesize){
        localStorage.setItem("pageSize",5)
       }
       const response=await axios.get(`http://localhost:5200/expense/pagination?page=${1}&pagesize=${totalPagesize}`,{headers:{"Authorization":token}})
                
                let allExpense=response.data.Data
                    
                    for(let i=0;i<allExpense.length;i++){ 
                        showOnScreen(response.data.Data[i])    
                        }
      for(let i=0;i<totalpage;i++){
            let page=i+1
            button=document.createElement("button")
            button.innerHTML=i+1
                button.onclick=async()=>{
                    allExpenses.innerHTML=""
                    const response=await axios.get(`http://localhost:5200/expense/pagination?page=${page}&pagesize=${totalPagesize}`,{headers:{"Authorization":token}})
                    let allExpense=response.data.Data
                    for(let i=0;i<allExpense.length;i++){
                        showOnScreen(response.data.Data[i])    
                        }
                } 
        pagination.appendChild(button)
        }  
    }catch(err){
        console.log("pagination error FE",err)
    }
   
}

//showing the data on the screen
function showOnScreen(show){
    try{
        const pagesize=document.getElementById("pagesize")
        pagesize.addEventListener("click",()=>{
            localStorage.setItem("pageSize",pagesize.value)
            window.location.reload()
           })
 
        const newExpense=`<table id=${parseInt(show._id)} class="table text-white ">
        <tr>
        <td><li></li></td>
        <td>${show.amount}</td>
        <td>${show.description}</td>
        <td>${show.category}</td>
        <td><button onclick="deleteExpense(${parseInt(show._id)})" style="float:right" class="btn btn-danger" >delete</button></td>
        </tr>
        </table>`
        allExpenses.innerHTML=allExpenses.innerHTML+newExpense
      
        
    }catch(err){
     console.log("error in showscreen",err)
    }
  
}

//deleting the expense
async function deleteExpense(key){
    try{
        const oneExpense=document.getElementById(key)
        allExpenses.removeChild(oneExpense)
        await axios.delete(`http://localhost:5200/expense/delete-expense/${key}`)
      
    }catch(err){
        console.log("delete expeses error-->",err)
    }
    
}

//Adding a expense to the database
addExpense.addEventListener("click",postExpense)
async function postExpense(e){
    try{
        e.preventDefault();
        const tokenId=localStorage.getItem("token")
        const decodeToken=parseJwt(tokenId)
        const expense_obj={
            amount:amount.value,
            description:description.value,
            category:category.value,
            userId:decodeToken.userId
        }
        const data=await axios.post("http://localhost:5200/expense/add-expense",expense_obj)
        showOnScreen(data.data.newExpense)
        const expensetext=document.getElementById("expensetext")  
        const success=document.createTextNode("Expense added successfully")
        expensetext.appendChild(success)   
        setTimeout(()=>{
           expensetext.removeChild(success)
           },2000)
        window.location.reload()
    }catch(err){
        console.log("addExpense Error->",err)
    }
   
}

//Buy premium button
document.getElementById("razorpay").onclick=async(e)=>{
    try{
        const token=localStorage.getItem("token")
        const resource=await axios.get("http://localhost:5200/purchase/premium-membership",{headers:{"Authorization":token}})
        
        let option={
        "key":resource.data.key_id,
        "order_id":resource.data.order.id,
        "handler":async function (res){
            const data=await axios.post("http://localhost:5200/purchase/updatePremium",{
                "order_id":option.order_id,
                "payment_id":res.razorpay_payment_id
            },{headers:{"Authorization":token} })
            alert("payment successfully done")
            document.getElementById("razorpay").style.visibility="hidden"
                localStorage.setItem("token",data.data.token)    
         },
        
   }
const raz1=new Razorpay(option)
raz1.open()
e.preventDefault()
 raz1.on("payment.failed",async function(){  
    try{
        const key=resource.data.order.id
    
        const response=await axios.post("http://localhost:5200/purchase/updatePremium",{
            "order_id":key,
            "payment_id":null
        },{headers:{"Authorization":token} })
        
        alert(response.data.message)
    }catch(err){
        console.log("error in payment failed section",err)
    }
   
})
 }catch(err){
    console.log("error in razorpay frontEnd-->",err)
 }
}

//leaderBoard feature-->premium membership
async function showLeaderBoard(){
    try{

       document.getElementById("addText").innerHTML="LeaderBoard"

            document.getElementById("leaderboard").innerHTML=""
            const token=localStorage.getItem("token")
           const response= await axios.get("http://localhost:5200/premium/leaderBoard",{headers:{"Authorization":token}})
            let parent=document.getElementById("leaderboard")
         
            response.data.forEach(ele => {
                if(ele.total_amount===null){
                    ele.total_amount=0
                }
            const child=   `<li class="">${ele.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ele.totalAmount}</li>`       
              parent.innerHTML=parent.innerHTML+child
              
            });
        // }
    }catch(err){
        console.log("err in showLeaderBoard")
    }
}

//premium feature download option
function downloadReport(){
    try{
        const token=localStorage.getItem("token")
        buttonDownload=document.createElement("input")
        buttonDownload.type="button"
        buttonDownload.value="Download"
        buttonDownload.setAttribute("class","btn btn-warning border-3 text-white")
       const reportText= document.createTextNode("Download Report")
       document.getElementById("reportText").appendChild(reportText)
        document.getElementById("buttons").appendChild(buttonDownload)
        buttonDownload.addEventListener("click",async(e)=>{
            e.preventDefault()
            const response= await axios.get("http://localhost:5200/expense/download",{headers:{"Authorization":token}})
            
            const a=document.createElement("a")
            a.href=response.data.url
            a.click()

        })
    }catch(err){
        console.log("error in download report-->",err)
    }
}

