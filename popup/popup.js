const pick_btn = document.querySelector(".changed_btn_color");
const colorGrid = document.querySelector(".colorGrid");
const colorValue = document.querySelector(".colorValue")
const errMsg = document.querySelector(".errorMsg")

pick_btn.addEventListener("click",async()=>{
    let [tab] =await chrome.tabs.query({active:true,currentWindow:true});
    // chrome extract data background page using storage
    chrome.storage.sync.get(["color"],({color})=>{
        console.log(`color = ${color}`)
    })

    // chrome excute script on any tabs
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func:findColor
    },async(injectColor)=>{
        // if Eyedropper tool does'nt support in browser
        if(!window.EyeDropper){
            errMsg.textContent = injectColor
        }
        // if Browser support EyeDropper Api
        const [data] = injectColor
        if(data.result){
            const color = data.result.sRGBHex
            colorGrid.style.backgroundColor = color
            colorValue.textContent = color
            // clipboard save color value 
            try{
               await navigator.clipboard.writeText(color)
            }catch(err){
                console.error(err)
            }
        }else{
            errMsg.textContent = "You don't select any color!"
        }
            

    })
})

async function findColor(){
    try{
        if(!window.EyeDropper){
            return 'Your browser does not support the EyeDropper Tool'
        }
        const eyeDropper = new EyeDropper();
        return await eyeDropper.open();
    }catch(err){
        console.error(err)
    }
}