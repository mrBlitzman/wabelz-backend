import axios from "axios";

const verifyCaptcha = async (token) => {
    try {
      const url = "https://www.google.com/recaptcha/api/siteverify";
      const params = new URLSearchParams();
      params.append("secret", process.env.CAPTCHA_SECRET);
      params.append("response", token);
  
      const response = await axios.post(url, params);
      const data = response.data;
  
      return data.success && data.score > 0.5;
    } catch (error) {
      console.error("CAPTCHA verification error:", error.message);
      return false;
    }
  };

  export default verifyCaptcha;