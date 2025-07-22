import { Component } from '@angular/core';

// You might need to import your modal components here if they are not standalone
// import { ModalCreateClientComponent } from './modal-create-client/modal-create-client.component';
// import { ModalContractComponent } from './modal-contract/modal-contract.component'; // Assuming this is your contract modal component

@Component({
  selector: 'app-clients', // Assuming this is the selector for your ClientsComponent
  templateUrl: './clients.component.html', // This should be the path to the HTML you provided
  styleUrls: ['./clients.component.css'],
  standalone: false
})
export class ClientsComponent {
  isModalOpen: boolean = false; // Controls app-modal-create-client
  isContractModalOpen: boolean = false; // NEW: Controls app-modal-contract
  createdClientData: any; // NEW: To store data from the created client

  constructor() {}

  // Existing method to toggle the create client modal
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    // Ensure contract modal is closed when opening create client modal
    if (this.isModalOpen) {
        this.isContractModalOpen = false;
        this.createdClientData = null; // Clear any previous client data
    }
  }

  // Existing method to close the create client modal
  closeModal() {
    this.isModalOpen = false;
  }

  // NEW: Method to open contract modal and pass data
  openContractModal(clientData: any) {
    this.closeModal(); // Close the client creation modal first
    this.createdClientData = clientData; // Store the client data
    this.isContractModalOpen = true; // Open the contract modal
    console.log('Client created, opening contract modal with data:', clientData);
  }

  // NEW: Method to close the contract modal
  closeContractModal() {
    this.isContractModalOpen = false;
    this.createdClientData = null; // Clear client data when modal closes
    console.log('Contract modal closed.');
  }

  // Existing methods for sidebar, etc.
  onUserChange(event: any) {
    // Handle user change logic
    console.log('User changed:', event);
  }
}