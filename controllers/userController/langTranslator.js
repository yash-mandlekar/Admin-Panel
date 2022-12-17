require("dotenv").config();
const { Translate } = require("@google-cloud/translate").v2;


const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

//configuration for the client
const translate=new Translate({
    credentials:CREDENTIALS,
    projectId:CREDENTIALS.project_id
});

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
exports.translate = async (req, res) => {
  const { text, text2, text3, text4, text5, target } = req.body;
  const translation = await translateText(text, target);
  if (text2) {
    var translation2 = await translateText(text2, target);
  }
  if (text3) {
    var translation3 = await translateText(text3, target);
  }
  if (text4) {
    var translation4 = await translateText(text4, target);
  }
  if (text5) {
    var translation5 = await translateText(text5, target);
  }
  res.send({
    translation: translation,
    translation2: translation2 && translation2,
    translation3: translation3 && translation3,
    translation4: translation4 && translation4,
    translation5: translation5 && translation5,
  });
};