// modal.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private editModalState = new BehaviorSubject<{ open: boolean, data?: any }>({ open: false });
  private duplicateModalState = new BehaviorSubject<{ open: boolean, data?: any }>({ open: false });
  private removeModalState = new BehaviorSubject<{ open: boolean, data?: any }>({ open: false });

  editModalState$ = this.editModalState.asObservable();
  duplicateModalState$ = this.duplicateModalState.asObservable();
  removeModalState$ = this.removeModalState.asObservable();

  openEditModal(data?: any) {
    this.editModalState.next({ open: true, data });
  }

  openDuplicateModal(data?: any) {
    this.duplicateModalState.next({ open: true, data });
  }

  openRemoveModal(data?: any) {
    this.removeModalState.next({ open: true, data });
  }

  closeEditModal() {
    this.editModalState.next({ open: false });
  }

  closeDuplicateModal() {
    this.duplicateModalState.next({ open: false });
  }

  closeRemoveModal() {
    this.removeModalState.next({ open: false });
  }
}