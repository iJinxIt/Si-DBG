# Usefull Commands
## Look at current flash memory
### Get flash memory from device
st-flash read flash_backup.bin 0x08000000 0x8000
### Look at disassembly
arm-none-eabi-objdump -D -b binary -m arm -M force-thumb --adjust-vma=0x08000000 flash_backup.bin | less