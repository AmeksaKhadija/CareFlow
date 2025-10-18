import express from 'express';
import appointmentController from '../Controllers/appointmentController.js';
import { verifyToken, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Créer un rendez-vous (Tous sauf patient sans dossier)
router.post('/', verifyToken, authorize('admin', 'medecin', 'infirmier', 'secretaire', 'patient'), appointmentController.createAppointment);

// Obtenir tous les rendez-vous (Admin, Secrétaire)
router.get('/', verifyToken, authorize('admin', 'secretaire'), appointmentController.getAllAppointments);

// Obtenir mes rendez-vous (Patient)
router.get('/my-appointments', verifyToken, authorize('patient'), appointmentController.getMyAppointments);

// Vérifier les disponibilités (Public ou protégé selon votre choix)
router.get('/availability', verifyToken, appointmentController.checkAvailability);

// Obtenir les rendez-vous d'un médecin
router.get('/doctor/:doctorId', verifyToken, authorize('admin', 'medecin', 'infirmier', 'secretaire'), appointmentController.getDoctorAppointments);

// Obtenir un rendez-vous par ID
router.get('/:id', verifyToken, appointmentController.getAppointmentById);

// Mettre à jour un rendez-vous
router.put('/:id', verifyToken, authorize('admin', 'medecin', 'infirmier', 'secretaire'), appointmentController.updateAppointment);

// Annuler un rendez-vous
router.patch('/:id/cancel', verifyToken, authorize('admin', 'medecin', 'infirmier', 'secretaire', 'patient'), appointmentController.cancelAppointment);

// Marquer comme complété (Médecin, Admin)
router.patch('/:id/complete', verifyToken, authorize('admin', 'medecin'), appointmentController.completeAppointment);

export default router;