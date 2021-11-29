import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  updateDoc,
  doc,
} from '@firebase/firestore';
import type { DocumentReference, DocumentData } from '@firebase/firestore'
import { app } from '$lib/configs/firebase';

export interface ProjectDoc {
  name: string,
  userId: string,
  id: string
}

export async function getProjects(userId: string): Promise<Array<ProjectDoc>> {
  try {
    const projects = [];
    const projectsSnapshot = await getDocs(
      query(collection(getFirestore(app), 'projects'), where('userId', '==', userId))
    );
    projectsSnapshot.forEach((doc) => {
      projects.push({ ...doc.data(), id: doc.id });
    });
  
    return projects
  } catch (error) {
    console.error(error)
    return null    
  }
}

export async function insertProject(userId: string, insertData: { name: string}): Promise<DocumentReference<DocumentData> | null> {
  try {
    const docRef = await addDoc(collection(getFirestore(app), 'projects'), {
      userId,
      ...insertData
    })
    return docRef
  } catch (error) {
    console.error(error)
    return null    
  }
}

export async function updateProject(projectId: string, updateData: { name: string }): Promise<true | null> {
  try {
    await updateDoc(doc(getFirestore(), `projects/${projectId}`), {
      ...updateData
    });
    return true
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteProject(projectId: string): Promise<true | null> {
  try {
    await deleteDoc(doc(getFirestore(), `projects/${projectId}`));
    return true
  } catch (error) {
    console.error(error)
    return null
  }
}
