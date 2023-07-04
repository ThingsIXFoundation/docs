---
title: Third-Party-Mapper Program
---

# Third-Party-Mapper Program

## Introduction

To facilitate the growth of the ThingsIX network, the availability of mappers is one of the critical factors. Not only to ensure that enough mappers are available, but also to make sure that mappers are available for all different regions in the world. 

Therefore, the ThingsIX Foundation has decided to launch the Third-Party-Mapper program. Using this program, we invite manufacturers that have a track-record in manufacturing LoRa-related devices to manufacture and sell ThingsIX Mappers. 

The ThingsIX Foundation will ensure the security of the Third-Party-Mappers by reviewing the design and doing the actual provisioning of the software and key-material on the mappers.

## Requirements

- The Third-Party-Mapper program is only available for manufacturers that have manufactured and sold LoRa-devices in volume successfully and exist at least 1 year. 
- The manufacturer cannot sell and/or collect pre-orders for mappers without prior written approval from the ThingsIX Foundation for the specific revision and model being sold. 
- The manufacturer is only allowed to directly sell the mapper on their own website as communicated to the Foundation. No resellers or distributors are allowed. 
- The ThingsIX Foundation will develop the software for the mapper, possibly in collaboration with the manufacturer. The ThingsIX Foundation may decide to open-source the software and all components required to build the software. 
- The ThingsIX Foundation reserves the right to refuse a manufacturer without giving a reason.
- The ThingsIX Foundation will physically review every manufactured mapper and only after deeming the mapper secure will program.
- The ThingsIX Foundation reserves the right to temporarily or permanently disable any individual mapper or all mappers of a certain manufacturer when it decides that the mappers are not sufficiently secure anymore or are used in gaming behaviors. The ThingsIX Foundation is not responsible for any damage as a result of such disabling of mappers.

## Process

### Project start-up
1. The manufacturer should contact the ThingsIX Foundation at `contact@thingsix.foundation` indicating that he wants to participate in the Third-Party-Mapper program and provide his company details and the preliminary details of the mapper to be manufactured.
2. The ThingsIX Foundation will review the application and send an invoice for the project-fees (see fees). 
3. After payment the ThingsIX Foundation will provide development-support and will review designs. 
4. Once a final hardware revision and model of the mapper has been created by the manufacturer the manufacturer will send samples of the mapper to the ThingsIX Foundation for approval of that specific revision and model. The ThingsIX Foundation will do software, hardware and RF testing. The ThingsIX Foundation will keep the mappers for further testing and validation.
5. The ThingsIX Foundation gives approval for that specific revision and model of the mapper.
6. The manufacturer can now sell the ThingsIX mapper on their own website.

### Manufacturing
1. The manufacturer will communicate with the ThingsIX Foundation to plan for the validation and provisioning of a batch of mappers. The ThingsIX Foundation will charge a fee for every mapper provisioned.
2. After approval by the ThingsIX Foundation manufacturer will send the mapper hardware to the ThingsIX Foundation for validation, software-programming and key-provisioning. The manufacturer has to pay for the shipping-fees and any duty. 
3. After validation, software-programming and key-provisioning, the mappers can be collected by the manufacturer for distribution. 


## Hardware requirements

Requirements for all mappers.

- The mapper has a STM32WL-based LoRa-IC. Other LoRa radio-ICs are not accepted due to security reasons.
- The mapper has a soldered omni-directional LoRa antenna with an average gain of 0 dBi when installed in the enclosure. No connector or footprint for a connector to connect an external LoRa antenna may be present on the PCB.
- The mapper has a U-Blox series M8, M9 or M10 GNSS-module. 
- The mapper has a GNSS antenna that supports the GPS and Galileo frequencies. The GNSS antenna may be external, however internal antennas are preferred.

For standard-software projects:

- The mapper has a ESP32 IC with Bluetooth antenna.
- The ESP32 is connected to the STM32WL IC via UART and 1 GPIO for reset. 
- The ESP32 is connected to the GNSS module via UART, 1 GPIO for reset and 1 GPIO for the 1PPS time-sync signal. 

The ESP32-IC can be replaced by another sufficiently powerful IC. However because the software possibly has to be adjusted, the standard-project-fees do not apply. It's advised to contact the ThingsIX Foundation to discuss possibilities. 

## Fees

- For projects that can use the standard software (ESP32-based): 7.500 EUR ex. VAT.
- Future revisions and models: To be discussed.
- Custom IC Projects: To be discussed.
- Mapper validation, software-programming,key-provisioning and registration on the ThingsIX Network: 50 EUR ex. VAT per mapper