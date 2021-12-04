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
  writeBatch
} from 'firebase/firestore';
import type { DocumentReference, DocumentData } from '@firebase/firestore'
import { app } from '$lib/configs/firebase';


export interface TaskDoc {
  id: string,
  name: string,
  done: boolean,
  notes: string,
  subtasks: Array<SubTask>
}

interface TaskPost {
  name: string
  done: boolean
}

interface SubTask {
  name: string,
  done: boolean
}

export async function getTasks(projectId: string): Promise<Array<TaskDoc>> {
  try {
    const tasks = [];
    const tasksSnapshot = await getDocs(
      query(collection(getFirestore(app), 'tasks'), where('projectId', '==', projectId))
    );
    tasksSnapshot.forEach((doc) => {
      tasks.push({ ...doc.data(), id: doc.id });
    });
  
    return tasks
  } catch (error) {
    console.error(error)
    return null    
  }
}

export async function insertTask(projectId: string, insertData: TaskPost): Promise<DocumentReference<DocumentData> | null> {
  try {
    const docRef = await addDoc(collection(getFirestore(app), 'tasks'), {
      projectId,
      ...insertData
    })
    return docRef
  } catch (error) {
    console.error(error)
    return null    
  }
}

export async function updateTask(taskId: string, updateData: Partial<TaskDoc>): Promise<true | null> {
  try {
    await updateDoc(doc(getFirestore(), `tasks/${taskId}`), {
      ...updateData
    });
    return true
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteTask(taskId: string): Promise<true | null> {
  try {
    await deleteDoc(doc(getFirestore(), `tasks/${taskId}`));
    return true
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteTasks(tasks: Array<TaskDoc>): Promise<true | null> {
  try {
    const batch = writeBatch(getFirestore());

    for (const task of tasks) {
      const docRef = doc(getFirestore(), 'tasks', task.id)
      batch.delete(docRef)
    }

    await batch.commit();
    return true
  } catch (error) {
    console.error(error)
    return null
  }
}