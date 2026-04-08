from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('swaps', '0002_swaprequest_meetup_note'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SwapMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='swap_messages', to=settings.AUTH_USER_MODEL)),
                ('swap', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='swaps.swaprequest')),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
    ]
