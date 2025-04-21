import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private visibleSubject = new BehaviorSubject<boolean>(false);
  visible$ = this.visibleSubject.asObservable();

  // Atualizar os BehaviorSubjects para usar a estrutura { open: boolean; data?: any }
  private editModalState = new BehaviorSubject<{ open: boolean; data?: any }>({ open: false });
  private duplicateModalState = new BehaviorSubject<{ open: boolean; data?: any }>({ open: false });
  private removeModalState = new BehaviorSubject<{ open: boolean; data?: any }>({ open: false });

  editModalState$: Observable<{ open: boolean; data?: any }> = this.editModalState.asObservable();
  duplicateModalState$: Observable<{ open: boolean; data?: any }> = this.duplicateModalState.asObservable();
  removeModalState$: Observable<{ open: boolean; data?: any }> = this.removeModalState.asObservable();

  openEditModal(data: any) {
    console.log('Abrindo modal de edição com dados:', data); // Depuração
    this.editModalState.next({ open: true, data });
  }

  openDuplicateModal(data: any) {
    console.log('Abrindo modal de duplicação com dados:', data); // Depuração
    this.duplicateModalState.next({ open: true, data });
  }

  openRemoveModal(data: any) {
    console.log('Abrindo modal de remoção com dados:', data); // Depuração
    this.removeModalState.next({ open: true, data });
  }

  closeEditModal() {
    console.log('Fechando modal de edição'); // Depuração
    this.editModalState.next({ open: false });
  }

  closeDuplicateModal() {
    console.log('Fechando modal de duplicação'); // Depuração
    this.duplicateModalState.next({ open: false });
  }

  closeRemoveModal() {
    console.log('Fechando modal de remoção'); // Depuração
    this.removeModalState.next({ open: false });
  }

  // Métodos genéricos mantidos
  open() {
    this.visibleSubject.next(true);
  }

  close() {
    this.visibleSubject.next(false);
  }
}