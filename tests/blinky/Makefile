CC 		= arm-none-eabi-gcc
OBJCOPY = arm-none-eabi-objcopy
SIZE	= arm-none-eabi-size

CFLAGS = -mcpu=cortex-m0plus -mthumb -Os -g -Wall -ffreestanding
LDFLAGS = -T link.ld -nostdlib -Wl,--gc-sections

all: blinky.bin

blinky.elf: main.c startup.c link.ld
	$(CC) $(CFLAGS) main.c startup.c $(LDFLAGS) -o $@
	$(SIZE) $@

blinky.bin: blinky.elf
	$(OBJCOPY) -O binary $< $@

flash: blinky.bin
	st-flash --reset write blinky.bin 0x08000000

clean:
	rm -f *.elf *.bin

.PHONY: all flash clean