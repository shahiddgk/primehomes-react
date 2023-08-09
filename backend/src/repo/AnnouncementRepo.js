const AnouncementModel = require("../models/AnouncementModel")

const AddAnouncement = async(obj) => {
    return await AnouncementModel.create(obj)
}


const updateById = async (announcementID, newData) => {
    try {
      
        return  await AnouncementModel.findByIdAndUpdate(
        {_id:announcementID},
        newData,
        { new: true }
      );
  
    } catch (error) {
     
      throw error;
    }
  };


  const getAllAnnouncements = async () => {
    return await AnouncementModel.find({});
  }


  const deleteAnnouncement = async(_id) => {
        try {
          return  await AnouncementModel.findByIdAndDelete({_id}); 
        } catch (error) {
          throw error;
        }
      };

module.exports = {
    AddAnouncement,
    updateById,
    getAllAnnouncements,
    deleteAnnouncement
}