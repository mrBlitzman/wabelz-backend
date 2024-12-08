import iso3311a2 from "iso-3166-1-alpha-2";
import xss from "xss";
import axios from "axios";

const validateOrder = async (formData, productData) => {
    const errors = {};

    const postData = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/proceedOrder", productData);
            return response.data;
        } catch (error) {
            console.error("Error occurred:", error.message);
            errors.product = error.message || "Product Error";
            return null;
        }
    }

    const order = await postData() || "errrrroor";

    const cleanedData = {
        name: xss(formData.name),
        email: xss(formData.email),
        phone: xss(formData.phone),
        country: xss(formData.country),
        industry: xss(formData.industry),
        websiteType: xss(formData.websiteType),
        goal: xss(formData.goal),
        description: xss(formData.description),
        additionalNote: xss(formData.additionalNote),
        terms: formData.terms,
        privacy: formData.privacy,
        emailList: formData.emailList
    };

    // Name ve surname validasyonu
    if (!cleanedData.name || cleanedData.name.trim() === "") {
        errors.name = "Name and Surname cannot be empty.";
    } else if (cleanedData.name.trim().length < 2 || cleanedData.name.trim().length > 50) {
        errors.name = "Name and Surname must be between 2 and 50 characters.";
    } else if (!/^[a-zA-ZçÇşŞıİöÖüÜğĞ]+( [a-zA-ZçÇşŞıİöÖüÜğĞ]+)*$/.test(cleanedData.name.trim())) {
        errors.name = "Name and Surname must contain only letters and spaces.";
    }

    // Phone validasyonu
    const phone = cleanedData.phone || "";
    if (!phone.trim()) {
        errors.phone = "Phone number is required.";
    } else if (!phone.startsWith("+")) {
        errors.phone = "Phone number must start with '+'.";
    } else if (!/^\+([1-9]{1,4})\d{1,14}$/.test(phone)) {
        errors.phone = "Phone number format is invalid. It should include a country code and contain up " +
                "to 15 digits.";
    }

    // Email validasyonu
    const email = cleanedData.email || "";
    if (!email.trim()) {
        errors.email = "Email is required.";
    } else if (email.length > 64) {
        errors.email = "Email must be 64 characters or fewer.";
    } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            errors.email = "Email format is invalid.";
        }

        const [localPart] = email.split("@");
        if (localPart && localPart.length > 64) {
            errors.email = "Local part of the email must be 64 characters or fewer.";
        }

        const domainPart = email.split("@")[1];
        if (domainPart && domainPart.length > 255) {
            errors.email = "Domain part of the email must be 255 characters or fewer.";
        }

        if (/[\s<>()[\]{};:'"\\|,]/.test(email)) {
            errors.email = "Email contains invalid characters.";
        }
    }

    // Country validasyonu
    const country = cleanedData.country || "";
    if (!country.trim()) {
        errors.country = "Country code is required.";
    } else if (!iso3311a2.getCountry(country)) {
        errors.country = "Invalid country code.";
    }

    // Industry validasyonu
    const industry = cleanedData.industry || "";
    if (!industry.trim()) {
        errors.industry = "Industry is required.";
    } else {
        const validIndustries = [ "Design", "Marketing", "Technology", "Finance", "Healthcare", "Education", "Real Estate", "Retail", "Manufacturing", "Construction", "Transportation", "Telecommunications", "Energy", "Entertainment", "Media", "Agriculture", "Hospitality", "Food & Beverage", "Nonprofit", "Legal", "Consulting", "Software Development", "Tourism", "Automotive", "Insurance", "Pharmaceuticals", "Aerospace", "Sports", "Mining", "Public Sector", "Fashion", "Music", "Publishing", "Gaming", "Charity", "Art & Culture", "Retail & E-commerce", "Business Services", "Events & Conferences", "Security" ];
        if (!validIndustries.includes(industry)) {
            errors.industry = "Invalid industry. Valid options are: Engineering, Marketing, Sales, Human Resour" +
                    "ces, Design.";
        }
    }

    // Website Type validasyonu
    const websiteType = cleanedData.websiteType || "";
    if (!websiteType.trim()) {
        errors.websiteType = "Website type is required.";
    } else {
        const validWebsiteTypes = [ 'E-commerce', 'Blog', 'Portfolio', 'Corporate', 'Landing', 'Business', 'Personal', 'Educational', 'Nonprofit', 'Community', 'News', 'Social', 'Media', 'Service', 'Event', 'Product', 'Entertainment', 'Directory', 'Resource', 'Agency', 'Marketplace', 'Government', 'Hospitality', 'Real Estate', 'Health', 'Technology', 'Creative', 'Consulting', 'Travel', 'Subscription', 'Fitness', 'Support', 'Restaurant', 'Online Course', 'Portfolio', 'Gallery', 'Forum', 'Podcast', 'News Portal', 'Digital', 'Platform', 'Review', 'Crowdfunding', 'Survey', 'App' ];
        if (!validWebsiteTypes.includes(websiteType)) {
            errors.websiteType = "Invalid website type. Valid options are: E-commerce, Blog, Portfolio, Corporate," +
                    " Landing.";
        }
    }

    // Goal validasyonu
    const goal = cleanedData.goal || "";
    if (!goal.trim()) {
        errors.goal = "Goal is required.";
    } else if (goal.length < 5 || goal.length > 50) {
        errors.goal = "Goal must be between 5 and 50 characters.";
    } else if (!/^[a-zA-Z\s.,!?]+$/.test(goal)) {
        errors.goal = "Goal must contain only letters, spaces, and basic punctuation (.,!?).";
    }

    // Description validasyonu
    const description = cleanedData.description || "";
    if (!description.trim()) {
        errors.description = "Description is required.";
    } else if (description.length < 10 || description.length > 100) {
        errors.description = "Description must be between 10 and 100 characters.";
    }

    // Additional Note validasyonu
    const additionalNote = cleanedData.additionalNote || "";
    if (additionalNote.length > 200) {
        errors.additionalNote = "Additional note must be shorter than 200 characters.";
    } else if (/[^a-zA-Z0-9\s.,!?]/.test(additionalNote)) {
        errors.additionalNote = "Additional note contains invalid characters.";
    }

    // Terms validasyonu
    if (cleanedData.terms != true) {
        errors.terms = "You must agree to the terms and conditions.";
    }

    // Privacy validasyonu
    if (cleanedData.privacy != true) {
        errors.privacy = "You must agree to the privacy policy.";
    }

    // emailList validasyonu
    if (cleanedData.emailList != true && cleanedData.emailList != false) {
        errors.emailList = "Email List must be a boolean value.";
    }

    return {errors, order};
};

export default validateOrder;
