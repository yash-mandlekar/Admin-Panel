require("dotenv").config();
const { Translate } = require("@google-cloud/translate").v2;


const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

//configuration for the client
const translate=new Translate({
    credentials:CREDENTIALS,
    projectId:CREDENTIALS.project_id
});

//detect language
const detectLanguage=async(text)=>{
 try{
     const [detection]=await translate.detect(text);
     console.log(detection);
     return detection.language;
  }catch(err){
      console.log(err);
  }
}

//translate text
const translateText=async(text,target)=>{
  try{
      const [translation]=await translate.translate(text,target);
      return translation;
  }catch(err){
      console.log(err);
  }
}

// detect language and translate text 
exports.translate=async(req,res)=>{
  const {text,target}=req.body;
  const language=await detectLanguage(text);
  const translation=await translateText(text,target);
  res.send({translation});
}