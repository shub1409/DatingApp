using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Repository.Photos
{
    public interface IPhotoRepository
    {
        Task<IEnumerable<PhotoForApprovalDto>>  GetUnApprovedPhotos(); 
        Task<Photo> GetPhotoById(int id);
        void RemovePhoto(Photo photo);
    }
}