let contentScrollPosition = 0
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
function showWaitingGif () {
  eraseContent()
  $('#content').append(
    $(
      "<div class='waitingGifcontainer'><img class='waitingGif' src='images/Loading_icon.gif' /></div>'"
    )
  )
}
function eraseContent () {
  $('#content').empty()
}
function saveContentScrollPosition () {
  contentScrollPosition = $('#content')[0].scrollTop
}
function restoreContentScrollPosition () {
  $('#content')[0].scrollTop = contentScrollPosition
}
function RenderHeader (text = "default", name = "default") {
  let currentUser = API.retrieveLoggedUser()
  //privilege 0 = anonyme, 1=user, 2=admin
  $('#header').empty()
  $('#header').append(
    $(`
    <span title="${text}" id="${name + "cmd"}">
        <img src="PhotosManager/images/PhotoCloudLogo.png" class="appLogo">
    </span>
    <span class="viewTitle">${text}
        ${text == "Liste des photos" ? '<div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div>' : ""}
    </span>
    <div class="headerMenusContainer">
        <span>&nbsp;</span> <!--filler-->
        <i title="Modifier votre profil">
            <div class="UserAvatarSmall" id="editProfilCmd"
                style="background-image:url('${currentUser === null? "" : currentUser.Avatar}')"
                title="${currentUser === null? "" : currentUser.Name}">
            </div>
        </i>
        <div data-bs-toggle="dropdown" aria-expanded="false">
            <i class="cmdIcon fa fa-ellipsis-vertical"></i>
        </div>
        <div class="dropdown-menu noselect">
<!--                    <div class="dropdown-divider"></div>-->
        </div>
    </div>
`));

if(currentUser !== null && currentUser.Authorizations.writeAccess === 2) {
$('.dropdown-menu').append($(`
<span class="dropdown-item" id="manageUserCm">
<i class="menuIcon fas fa-user-cog mx-2"></i>
Gestion des usagers
</span>`));}

if(currentUser !== null) {
$('.dropdown-menu').append($(`
<div class="dropdown-divider"></div>
<span class="dropdown-item" id="logoutCmd" onlcick="() => {
  API.logout().then(() => {
      renderConnexion()
  })">
<i class="menuIcon fa fa-sign-out mx-2"></i>
Déconnexion
</span>`));}

if(currentUser === null) {
$('.dropdown-menu').append($(`
<div class="dropdown-divider"></div>
<span class="dropdown-item" id="loginCmd" onclick="renderLoginForm()">
<i class="menuIcon fa fa-sign-out mx-2"></i>
Connexion
</span>`));}

if(currentUser !== null) {
$('.dropdown-menu').append($(`
<span class="dropdown-item" id="editProfilMenuCmd">
<i class="menuIcon fa fa-user-edit mx-2"></i>
Modifier votre profil
</span>

<div class="dropdown-divider"></div>
<span class="dropdown-item" id="listPhotosMenuCmd">
<i class="menuIcon fa fa-image mx-2"></i>
Liste des photos
</span>

<div class="dropdown-divider"></div>
<span class="dropdown-item" id="sortByDateCmd">
<i class="menuIcon fa fa-check mx-2"></i>
<i class="menuIcon fa fa-calendar mx-2"></i>
Photos par date de création
</span>

<span class="dropdown-item" id="sortByOwnersCmd">
<i class="menuIcon fa fa-fw mx-2"></i>
<i class="menuIcon fa fa-users mx-2"></i>
Photos par créateur
</span>

<span class="dropdown-item" id="sortByLikesCmd">
<i class="menuIcon fa fa-fw mx-2"></i>
<i class="menuIcon fa fa-user mx-2"></i>
Photos les plus aiméés
</span>

<span class="dropdown-item" id="ownerOnlyCmd">
<i class="menuIcon fa fa-fw mx-2"></i>
<i class="menuIcon fa fa-user mx-2"></i>
Mes photos
</span>`));}

$('.dropdown-menu').append($(`
<div class="dropdown-divider"></div>
<span class="dropdown-item" id="aboutCmd" onclick="renderAbout()">
<i class="menuIcon fa fa-info-circle mx-2"></i>
À propos...
</span>`));
}
function renderAbout() {
  timeout()
  saveContentScrollPosition()
  eraseContent()
  RenderHeader('À propos...', 'propos')

  $('#content').append(
    $(`
            <div class="aboutContainer">
                <h2>Gestionnaire de photos</h2>
                <hr>
                <p>
                    Petite application de gestion de photos multiusagers à titre de démonstration
                    d'interface utilisateur monopage réactive.
                </p>
                <p>
                    Auteur: Nicolas Chourot
                </p>
                <p>
                    Collège Lionel-Groulx, automne 2023
                </p>
            </div>
        `));
}
function renderLoginForm (
  loginMessage = '',
  Email = '',
  EmailError = '',
  passwordError = ''
) {
  saveContentScrollPosition();
  eraseContent();
  RenderHeader('Se connecter', 'login');

  $('#content').append(
    $(`
        <div class="content" style="text-align:center">
        <h3>${loginMessage}</h3>
        <form class="form" id="loginForm">
        <input type='email'
        name='Email'
        class="form-control"
        required
        RequireMessage = 'Veuillez entrer votre courriel'
        InvalidMessage = 'Courriel invalide'
        placeholder="adresse de courriel"
        value='${Email}'>
        <span style='color:red'>${EmailError}</span>
        <input type='password'
        name='Password'
        placeholder='Mot de passe'
        class="form-control"
        required
        RequireMessage = 'Veuillez entrer votre mot de passe'>
        <span style='color:red'>${passwordError}</span>
        <input type='submit' name='submit' value="Entrer" class="form-control btn-primary">
        </form>
        <div class="form">
        <hr>
        <button class="form-control btn-info" id="createProfilCmd" onclick="renderUserCreationForm()">Nouveau compte</button>
        </div>
        </div>
        `));
}
function renderUserCreationForm() {
  noTimeout()
  saveContentScrollPosition()
  eraseContent()
  RenderHeader('Inscription', 'register')

  $('#content').append(
    $(`
        <form class="form" id="createProfilForm"'>
        <fieldset>
        <legend>Adresse ce courriel</legend>
        <input type="email"
        class="form-control Email"
        name="Email"
        id="Email"
        placeholder="Courriel"
        required
        RequireMessage = 'Veuillez entrer votre courriel'
        InvalidMessage = 'Courriel invalide'
        CustomErrorMessage ="Ce courriel est déjà utilisé"/>
        <input class="form-control MatchedInput"
        type="text"
        matchedInputId="Email"
        name="matchedEmail"
        id="matchedEmail"
        placeholder="Vérification"
        required
        RequireMessage = 'Veuillez entrez de nouveau votre courriel'
        InvalidMessage="Les courriels ne correspondent pas" />
        </fieldset>
        <fieldset>
        <legend>Mot de passe</legend>
        <input type="password"
        class="form-control"
        name="Password"
        id="Password"
        placeholder="Mot de passe"
        required
        RequireMessage = 'Veuillez entrer un mot de passe'
        InvalidMessage = 'Mot de passe trop court'/>
        <input class="form-control MatchedInput"
        type="password"
        matchedInputId="Password"
        name="matchedPassword"
        id="matchedPassword"
        placeholder="Vérification" required
        InvalidMessage="Ne correspond pas au mot de passe" />
        </fieldset>
        <fieldset>
        <legend>Nom</legend>
        <input type="text"
        class="form-control Alpha"
        name="Name"
        id="Name"
        placeholder="Nom"
        required
        RequireMessage = 'Veuillez entrer votre nom'
        InvalidMessage = 'Nom invalide'/>
        </fieldset>
        <fieldset>
        <legend>Avatar</legend>
        <div class='imageUploader'
        newImage='true'
        controlId='Avatar'
        imageSrc='images/no-avatar.png'
        waitingImage="images/Loading_icon.gif">
        </div>
        </fieldset>
        <input type='submit' name='submit' id='saveUserCmd' value="Enregistrer" class="form-control btn-primary">
        </form>
        <div class="cancel">
        <button class="form-control btn-secondary" id="abortCmd" onclick="renderLoginForm()">Annuler</button>
        </div>
        `)
  )
}
function renderProfil() {
  saveContentScrollPosition()
  eraseContent()
  RenderHeader('Profil', 'profil')
  $('#content').append(
    $(`
        <form class="form" id="editProfilForm"'>
        <input type="hidden" name="Id" id="Id" value="${loggedUser.Id}"/>
        <fieldset>
        <legend>Adresse ce courriel</legend>
        <input type="email"
        class="form-control Email"
        name="Email"
        id="Email"
        placeholder="Courriel"
        required
        RequireMessage = 'Veuillez entrer votre courriel'
        InvalidMessage = 'Courriel invalide'
        CustomErrorMessage ="Ce courriel est déjà utilisé"
        value="${loggedUser.Email}" >
        <input class="form-control MatchedInput"
        type="text"
        matchedInputId="Email"
        name="matchedEmail"
        id="matchedEmail"
        placeholder="Vérification"
        required
        RequireMessage = 'Veuillez entrez de nouveau votre courriel'
        InvalidMessage="Les courriels ne correspondent pas"
        value="${loggedUser.Email}" >
        </fieldset>
        <fieldset>
        <legend>Mot de passe</legend>
        <input type="password"
        class="form-control"
        name="Password"
        id="Password"
        placeholder="Mot de passe"
        InvalidMessage = 'Mot de passe trop court' >
        <input class="form-control MatchedInput"
        type="password"
        matchedInputId="Password"
        name="matchedPassword"
        id="matchedPassword"
        placeholder="Vérification"
        InvalidMessage="Ne correspond pas au mot de passe" >
        </fieldset>
        <fieldset>
        <legend>Nom</legend>
        <input type="text"
        class="form-control Alpha"
        name="Name"
        id="Name"
        placeholder="Nom"
        required
        RequireMessage = 'Veuillez entrer votre nom'
        InvalidMessage = 'Nom invalide'
        value="${loggedUser.Name}" >
        </fieldset>
        <fieldset>
        <legend>Avatar</legend>
        <div class='imageUploader'
        newImage='false'
        controlId='Avatar'
        imageSrc='${loggedUser.Avatar}'
        waitingImage="images/Loading_icon.gif">
        </div>
        </fieldset>
        <input type='submit'
        name='submit'
        id='saveUserCmd'
        value="Enregistrer"
        class="form-control btn-primary">
        </form>
        <div class="cancel">
        <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
        </div>
        <div class="cancel"> <hr>
        <a href="confirmDeleteProfil.php">
        <button class="form-control btn-warning">Effacer le compte</button>
        </a>
        </div>
        `)
  )
}
