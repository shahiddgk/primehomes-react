const { badRequest, successResponse } = require('../config/responceHandler');
const AnnouncementRepo = require('../repo/AnnouncementRepo');
const { createNotification } = require('./NotificationController');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dwf0svqiw', 
    api_key: '695943357591853', 
    api_secret: 'tX0GG4ca2J1h3fntFdHAI8iYLXo' 
  });

const createAnnouncemnt = async (req, res, next) => {
    try {
        
      console.log(req.body);
        const { title, description, announcementType, audience } = req.body;
        if (!(title && description && announcementType && req.files.image && audience)) {
            return badRequest(res, 'Please Provide Required With Request', [])
        }
        const imageFile = req.files.image;
        const audienceArray = Array.isArray(audience) ? audience : [audience];
        const result = await cloudinary.uploader.upload(imageFile.tempFilePath);

        const announcement = await AnnouncementRepo.AddAnouncement({title, description, announcementType, imageUrl: result.secure_url, audience: audienceArray})

        if (!announcement) {
            return badRequest(res, 'Something Went Wrong', [])
        }
        await createNotification(announcement._id, announcement.title, announcement.description, announcement.imageUrl, announcement.announcementType, audienceArray, req)
        return successResponse(res, 'Annoucement Created Successfuly', announcement, 200)

    } catch (error) {
        next(error)
    }
}

const updateAnnouncement = async (req, res, next) => {   
    try{

        const {title, description, announcementType, audience} = req.body
        const {announcementID} = req.params;
        if (!(title && description && announcementType && req.files && req.files.image)) {
            return badRequest(res, 'Please Provide Required Fields With Request', []);
          }
        const imageFile = req.files.image;
        console.log(title, description, announcementType);
        const result = await cloudinary.uploader.upload(imageFile.tempFilePath);
      
        let announcement = await AnnouncementRepo.updateById(announcementID, {
            title,
            description,
            announcementType,
            imageUrl: result.secure_url,
            audience
          });
      
          if (!announcement) {
            return badRequest(res, 'Something Went Wrong', []);
          }
      
          successResponse(res, 'Announcement Updated Successfully', announcement, 200);
      
    }catch(err){
        next(err)
    }
}

const getAllAnnouncements = async (req, res, next) => {
    try {
      
      const announcements = await AnnouncementRepo.getAllAnnouncements();
  
      
      return successResponse(res, 'Fetched all announcements successfully', announcements, 200);
    } catch (error) {
      // Handle any errors that might occur during the fetch all operation
      next(error);
    }
  };

  const deleteAnnouncement = async (req, res, next) => {
    try {
      const { announcementID } = req.params;
  
      const deletedAnnouncement = await AnnouncementRepo.deleteAnnouncement(announcementID);
  
      if (!deletedAnnouncement) {
        return badRequest(res, 'Announcement not found',[]);
      }
  
     return successResponse(res, 'Announcement deleted successfully', deletedAnnouncement, 200);
    } catch (error) {
      next(error);
    }
  };


module.exports = {
    createAnnouncemnt,
    updateAnnouncement,
    getAllAnnouncements,
    deleteAnnouncement

}