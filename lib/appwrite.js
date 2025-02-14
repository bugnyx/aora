import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: "com.mad.aora",
    projectId: "671cd72a002cf6ef741b",
    databaseId: "671cddf400384d0f16a5",
    userCollectionId: "671cde54002193ebd545",
    videoCollectionId: "671cde91001584e6f0ca",
    storageId: "671ce1080035b4e94355"
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
// Register User
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
    );

    if (!newAccount) throw Error;
    
    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
        config.databaseId,
        config.userCollectionId,
        ID.unique(),
        {
            account: newAccount.$id,
            email,
            username,
            avatar: avatarUrl
        }
    )
    return newUser;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
    }

export async function signIn(email, password) {
    try {
        const session = await account.createSession(email, password);
    return session;
    } catch (error) {
        throw new Error(error);
    }
}