import Model from './model.js';
import Repository from '../models/repository.js';
import UserModel from '../models/user.js';

export default class PhotoLike extends Model {
    constructor()
    {
        super();
        this.addField('UserId', 'string');
        this.addField('PhotoId', 'string');        

        this.setKey("PhotoId");
    }

    bindExtraData(instance) {
        instance = super.bindExtraData(instance);
        let usersRepository = new Repository(new UserModel());
        let owner = usersRepository.get(instance.OwnerId);
        instance.OwnerName = owner.Name;
        instance.OwnerAvatar = owner.Avatar;
        return instance;
    }
}