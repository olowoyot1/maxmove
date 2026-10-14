import { PrismaClient, ShipmentStatus, UserRole, ShipmentType, ShippingMode } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main(){
 const passwordHash=await bcrypt.hash('Maxmove2025!',12);
 const admin=await prisma.user.upsert({where:{email:'admin@maxmove.com'},update:{passwordHash,role:UserRole.ADMIN},create:{name:'MaxMove Admin',email:'admin@maxmove.com',passwordHash,role:UserRole.ADMIN}});
 const customer=await prisma.customer.upsert({where:{id:'demo-customer'},update:{},create:{id:'demo-customer',name:'Apex Fashion Ltd',email:'ops@apex.test',phone:'+234 800 000 0000',address:'Victoria Island, Lagos',customerType:'CORPORATE'}});
 const order=await prisma.order.upsert({where:{orderNumber:'MM-ORD-1001'},update:{},create:{orderNumber:'MM-ORD-1001',customerId:customer.id}});
 const shipment=await prisma.shipment.upsert({where:{trackingNumber:'MMX-2026-0001'},update:{},create:{trackingNumber:'MMX-2026-0001',orderId:order.id,shipmentType:ShipmentType.INTERNATIONAL,shippingMode:ShippingMode.AIR,senderName:'Apex Fashion Ltd',receiverName:'David Okafor',origin:'Lagos, Nigeria',destination:'London, United Kingdom',originCountry:'Nigeria',destinationCountry:'United Kingdom',originState:'Lagos',originCity:'Lagos',destinationCity:'London',cargoDescription:'Fashion merchandise',weightKg:85,pieces:6,serviceType:'International Air Freight',cost:1250000,status:ShipmentStatus.IN_TRANSIT,currentLocation:'Heathrow Cargo Terminal',estimatedDelivery:new Date('2026-09-30T12:00:00Z')}});
 const count=await prisma.trackingEvent.count({where:{shipmentId:shipment.id}}); if(!count) await prisma.trackingEvent.createMany({data:[{shipmentId:shipment.id,status:ShipmentStatus.BOOKED,location:'Lagos, Nigeria',note:'Shipment booking confirmed',updatedById:admin.id},{shipmentId:shipment.id,status:ShipmentStatus.PICKED_UP,location:'Victoria Island, Lagos',note:'Cargo picked up',updatedById:admin.id},{shipmentId:shipment.id,status:ShipmentStatus.AT_WAREHOUSE,location:'MaxMove Lagos Hub',note:'Cargo received at export hub',updatedById:admin.id},{shipmentId:shipment.id,status:ShipmentStatus.IN_TRANSIT,location:'Heathrow Cargo Terminal',note:'Latest movement recorded by operations',updatedById:admin.id}]});
 console.log({admin:admin.email,tracking:shipment.trackingNumber});
}
main().finally(()=>prisma.$disconnect());
