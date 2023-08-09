const VisitorsRepo = require('../repo/VisitorsRepo');
const { badRequest, errorResponse, successResponse } = require('../config/responceHandler');
const PeopleRepo = require('../repo/PeopleRepo');
const cloudinary = require('cloudinary').v2;
const qrcode = require("qrcode");

cloudinary.config({
    cloud_name: 'dwf0svqiw',
    api_key: '695943357591853',
    api_secret: 'tX0GG4ca2J1h3fntFdHAI8iYLXo'
});
const getVisitors = async (req, res, next) => {
    try {
        const AllVisitors = await VisitorsRepo.getAllVisitors();
        successResponse(res, 'Fetched Visitors', AllVisitors, 200);
    } catch (err) {
        next(err);
    }
};
const getVisitorCards = async (req, res, next) => {
    try {
      const AllVisitors = await VisitorsRepo.getVisitors();
  
      const payload = await Promise.all(
        AllVisitors.map(async (x) => {
            console.log('id', x._id);
          try {
            const qr_code = await new Promise((resolve, reject) => {
              qrcode.toDataURL(x._id.toString(), (err, src) => {
                if (err) {
                  reject(new Error("Something went wrong!!"));
                } else {
                  resolve(src);
                }
              });
            });
  
            return {
              ...x._doc,
              qrcodeImage: qr_code,
            };
          } catch (error) {
            return {
              ...x._doc,
              qrcodeImage: null, // Set an appropriate value for failed QR code generation
            };
          }
        })
      );
  
      successResponse(res, 'Fetched Visitors', payload, 200);
    } catch (err) {
      next(err);
    }
  };
  

const createVisitor = async (req, res, next) => {
    try {
        const { _id } = req.userData;
        const { name, email, mobile } = req.body;
        if (!(name && email && mobile && req.files.image)) {
            return badRequest(res, 'Please Provide the Required Data with Request!', []);
        }

        const imageFile = req.files.image;
        const result = await cloudinary.uploader.upload(imageFile.tempFilePath);
        image = result.secure_url;

        const checkVisitorExisting = await VisitorsRepo.findOneByObject({ email });
        if (checkVisitorExisting) {
            return badRequest(res, 'Visitor Already Exists', []);
        }
        const newVisitor = await VisitorsRepo.addVisitors({ name, email, mobile, userId: _id, image });
        if (!newVisitor) {
            return errorResponse(res, 'Something Went Wrong', [], 502);
        }

        await PeopleRepo.addVisitor(_id, newVisitor._id);
        successResponse(res, 'Visitor Created Successfully', newVisitor, 201);
    } catch (err) {
        next(err);
    }
};

const updateVisitors = async (req, res, next) => {
    try {
        const { visitorID } = req.params;
        const { name, email, mobile } = req.body;
        if (!(name && email && mobile && visitorID && req.files.image)) {
            return badRequest(res, 'Please Provide the Required Data with Request!', []);
        }
        const imageFile = req.files.image;
        const result = await cloudinary.uploader.upload(imageFile.tempFilePath);
        image = result.secure_url;

        const isVisitorExist = await VisitorsRepo.findOneByObject({ _id: visitorID });
        if (!isVisitorExist) {
            return badRequest(res, 'Visitor ID Does Not Match Any Visitor!', [], 404);
        }
        const { _id } = req.userData;
        const updatedVisitor = await VisitorsRepo.updateByObj(isVisitorExist._id, {
            name,
            email,
            mobile,
            userId: _id,
            image,
        });
        if (!updatedVisitor) {
            return errorResponse(res, 'Something Went Wrong, Please Try Again', [], 502);
        }
        successResponse(res, 'Visitor Updated Successfully.', updatedVisitor, 201);
    } catch (err) {
        next(err);
    }
};

const softDeleteVisitor = async (req, res, next) => {
    try {
        const { visitorID } = req.params;
        if (!visitorID) {
            return badRequest(res, 'Please Provide Required Data with Request', []);
        }

        const isVisitorExist = await VisitorsRepo.findOneByObject({ _id: visitorID });
        if (!isVisitorExist) {
            return badRequest(res, 'Visitor ID Does Not Match Any Visitor!', [], 404);
        }
        const softDelete = await VisitorsRepo.softDeleteById(visitorID);

        successResponse(res, 'Visitor Deleted Successfully.', softDelete, 202);
    } catch (err) {
        next(err);
    }
};

const updateVisitorStatus = async (req, res, next) => {
    const {visitorID} = req.params;
    const {status} = req.body
    console.log('status', status);
    if (!(status && visitorID)) {
        return badRequest(res, 'Please provide required data with the request',[])
    }
    const checkVisitorExisting = await VisitorsRepo.findOneByObject({_id: visitorID})
    if (!checkVisitorExisting) {
        return badRequest(res, 'Visitor Not Found', [], 404)
    }

    const updatedVisitor = await VisitorsRepo.updateStatus(visitorID, status)
    if (!updatedVisitor) {
        return badRequest(res, 'Something Went wrong, please try again', [])
    }
    return successResponse(res, 'Visitor Status Updated Successfully',updatedVisitor, 200)
}


module.exports = {
    getVisitors,
    createVisitor,
    updateVisitors,
    softDeleteVisitor,
    updateVisitorStatus,
    getVisitorCards
};
