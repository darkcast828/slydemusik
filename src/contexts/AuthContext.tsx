import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

interface UserProfile {
  email: string;
  role: 'artist' | 'admin';
  displayName?: string;
  photoURL?: string;
  hasPaid?: boolean;
  status?: 'pending' | 'approved' | 'rejected' | 'em_revisao';
  paymentSubmitted?: boolean;
  subscriptionExpiresAt?: any;
  createdAt: any;
  notifications?: {
    emailDistributed: boolean;
    emailRejected: boolean;
  };
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result globally
    getRedirectResult(auth).then((result) => {
      if (result) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          import('../utils/googleAuth').then(m => m.setGoogleAccessToken(credential.accessToken));
        }
      }
    }).catch(console.error);

    let unsubscribeProfile: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch or create user profile
        try {
          const userDocRef = doc(db, 'users', user.uid);
          
          unsubscribeProfile = onSnapshot(userDocRef, async (userDoc) => {
            if (userDoc.exists()) {
              setUserProfile(userDoc.data() as UserProfile);
            } else {
              // Create new profile
              const newProfile: UserProfile = {
                email: user.email || '',
                role: 'artist',
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                hasPaid: false,
                status: 'pending',
                createdAt: serverTimestamp(),
              };
              await setDoc(userDocRef, newProfile);
              setUserProfile(newProfile);
            }
            setLoading(false);
          });
        } catch (error) {
          console.error("Error fetching/creating user profile:", error);
          setLoading(false);
        }
      } else {
        setUserProfile(null);
        if (unsubscribeProfile) {
          unsubscribeProfile();
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
