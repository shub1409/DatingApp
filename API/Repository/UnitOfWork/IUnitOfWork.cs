using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Repository.Likes;
using API.Repository.Messages;
using API.Repository.Photos;

namespace API.Repository.UnitOfWork
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository {get;}
        IMessageRepository MessageRepository {get;}
        ILikesRepository LikesRepository {get;}
        IPhotoRepository PhotoRepository { get; } 
        Task<bool> Complete();
        bool HasChanges();

    }
}