import Authorizations from '../authorizations.js';
import Repository from '../models/repository.js';
import PhotoLikeModel from '../models/photoLike.js';
import Controller from './Controller.js';

export default class PhotoLikes extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new PhotoLikeModel()), Authorizations.user()); //get returns array of userids that liked
        //post addLike
        //delete removeLike
        //this.photoLikesRepository = new Repository(new PhotoLikeModel());
    }
}